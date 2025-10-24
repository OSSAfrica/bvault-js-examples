import React, {useState, useEffect} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import {hasPermission} from '@/utils/permissions';
import {getTasks, saveTasks, getUsers} from '@/utils/storage';
import {Task, User} from '@/types';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Plus, Edit, Trash2, CheckSquare} from 'lucide-react';
import {AddTaskDialog} from './AddTaskDialog';
import {EditTaskDialog} from './EditTaskDialog';

export const TasksView: React.FC = () => {
    const {user: currentUser} = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(false);

    const [canManageTasks, setCanManageTasks] = useState<boolean>(false);
    const [canViewAllTasks, setCanViewAllTasks] = useState<boolean>(false);
    const [canDeleteTasks, setCanDeleteTasks] = useState<boolean>(false);

    useEffect(() => {
        const loadPermissions = async () => {
            const [manage, viewAll, deleteTasks] = await Promise.all([
                hasPermission(currentUser, 'canManageTasks'),
                hasPermission(currentUser, 'canViewAllTasks'),
                hasPermission(currentUser, 'canDeleteTasks')
            ]);
            setCanManageTasks(manage);
            setCanViewAllTasks(viewAll);
            setCanDeleteTasks(deleteTasks);
        };
        loadPermissions().then();
    }, [currentUser]);

    useEffect(() => {
        Promise.all([loadTasks(), loadUsers()]).then();
    }, []);

    useEffect(() => {
        Promise.all([loadTasks(), loadUsers()]).then();
    }, []);

    const loadTasks = async () => {
        const allTasks = await getTasks();
        const hasViewAllPermission = await hasPermission(currentUser, 'canViewAllTasks');
        const filteredTasks = hasViewAllPermission
            ? allTasks
            : allTasks.filter(task => task.assignedTo === currentUser?.id);
        setTasks(filteredTasks);
    };

    const loadUsers = async () => {
        const allUsers = await getUsers();
        setUsers(allUsers);
    };

    const handleAddTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'createdBy'>) => {
        setLoading(true);
        try {
            const newTask: Task = {
                ...taskData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                createdBy: currentUser?.id || '',
            };

            const allTasks = await getTasks();
            const updatedTasks = [...allTasks, newTask];
            await saveTasks(updatedTasks);
            await loadTasks(); // Reload to apply filters
            setShowAddDialog(false);
        } finally {
            setLoading(false);
        }
    };

    const handleEditTask = async (taskData: Task) => {
        setLoading(true);
        try {
            const allTasks = await getTasks();
            const updatedTasks = allTasks.map(t => t.id === taskData.id ? taskData : t);
            await saveTasks(updatedTasks);
            await loadTasks(); // Reload to apply filters
            setEditingTask(null);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (confirm('Are you sure you want to delete this task?')) {
            const allTasks = await getTasks();
            const updatedTasks = allTasks.filter(t => t.id !== taskId);
            await saveTasks(updatedTasks);
            await loadTasks(); // Reload to apply filters
        }
    };

    const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
        const allTasks = await getTasks();
        const updatedTasks = allTasks.map(t =>
            t.id === taskId ? {...t, status: newStatus} : t
        );
        await saveTasks(updatedTasks);
        await loadTasks(); // Reload to apply filters
    };

    const getStatusBadgeVariant = (status: Task['status']) => {
        switch (status) {
            case 'completed':
                return 'default';
            case 'in-progress':
                return 'secondary';
            case 'pending':
                return 'outline';
            default:
                return 'outline';
        }
    };

    const getPriorityBadgeVariant = (priority: Task['priority']) => {
        switch (priority) {
            case 'high':
                return 'destructive';
            case 'medium':
                return 'default';
            case 'low':
                return 'secondary';
            default:
                return 'secondary';
        }
    };

    const getUserById = (userId: string) => {
        return users.find(u => u.id === userId);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
                    <p className="text-gray-600 mt-2">
                        {canViewAllTasks ? 'Manage all system tasks' : 'Manage your assigned tasks'}
                    </p>
                </div>
                {canManageTasks && (
                    <Button onClick={() => setShowAddDialog(true)}>
                        <Plus className="h-4 w-4 mr-2"/>
                        Add Task
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task) => {
                    const assignedUser = getUserById(task.assignedTo);
                    const canEditTask = canManageTasks || task.assignedTo === currentUser?.id;

                    return (
                        <Card key={task.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">{task.title}</CardTitle>
                                        <CardDescription className="mt-1">
                                            {task.description}
                                        </CardDescription>
                                    </div>
                                    <CheckSquare className="h-5 w-5 text-gray-400"/>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    <Badge variant={getStatusBadgeVariant(task.status)}>
                                        {task.status}
                                    </Badge>
                                    <Badge variant={getPriorityBadgeVariant(task.priority)}>
                                        {task.priority}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div>
                                        <span className="font-medium">Assigned to:</span>{' '}
                                        {assignedUser?.username || 'Unknown User'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Created:</span>{' '}
                                        {new Date(task.createdAt).toLocaleDateString()}
                                    </div>
                                    {task.dueDate && (
                                        <div>
                                            <span className="font-medium">Due:</span>{' '}
                                            {new Date(task.dueDate).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>

                                {canEditTask && (
                                    <div className="flex gap-2 mt-4">
                                        {task.status !== 'completed' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleStatusChange(task.id,
                                                    task.status === 'pending' ? 'in-progress' : 'completed'
                                                )}
                                            >
                                                {task.status === 'pending' ? 'Start' : 'Complete'}
                                            </Button>
                                        )}
                                        {canManageTasks && (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setEditingTask(task)}
                                                >
                                                    <Edit className="h-4 w-4 mr-1"/>
                                                    Edit
                                                </Button>
                                                {canDeleteTasks && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteTask(task.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1"/>
                                                        Delete
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {tasks.length === 0 && (
                <Card>
                    <CardContent className="text-center py-8">
                        <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
                        <p className="text-gray-500">
                            {canViewAllTasks ? 'No tasks found' : 'No tasks assigned to you'}
                        </p>
                    </CardContent>
                </Card>
            )}

            <AddTaskDialog
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
                onSubmit={handleAddTask}
                users={users}
                loading={loading}
            />

            {editingTask && (
                <EditTaskDialog
                    open={!!editingTask}
                    onOpenChange={(open) => !open && setEditingTask(null)}
                    task={editingTask}
                    onSubmit={handleEditTask}
                    users={users}
                    loading={loading}
                />
            )}
        </div>
    );
};