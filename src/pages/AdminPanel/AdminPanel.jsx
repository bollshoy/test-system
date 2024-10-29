import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {collection, getDocs, updateDoc, doc, deleteDoc} from 'firebase/firestore';
import {toast} from 'react-toastify';
import {db} from '/firebase';
import loading from "../../components/Loading/Loading.jsx";
import Loading from "../../components/Loading/Loading.jsx";

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const userRole = useSelector(state => state.role);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'User'));
                const userList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUsers(userList);
            } catch (error) {
                console.error('Ошибка при загрузке пользователей:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateDoc(doc(db, 'User', userId), {role: newRole});
            setUsers(users.map(user => user.id === userId ? {...user, role: newRole} : user));
            toast.success('Роль успішно оновлена!');
        } catch (error) {
            toast.error('Помилка при оновлені ролі');
        }
    };

    const handleDeleteUser = async (userId) => {
        const userRef = doc(db, 'User', userId);
        await deleteDoc(userRef);
        setUsers(users.filter(user => user.id !== userId));
    };

    const handleBanUser = async (userId) => {
        const userRef = doc(db, 'User', userId);
        await updateDoc(userRef, { banned: true });
        setUsers(users.map(user => (user.id === userId ? { ...user, banned: true } : user)));
    };

    if (loading) {
        return <Loading/>
    }
    return userRole === 'admin' ? (
        <div>
            <h2>Админ-панель</h2>
            <table>
                <thead>
                <tr>
                    <th>Email</th>
                    <th>Имя</th>
                    <th>Роль</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.email}</td>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>
                            <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.id, e.target.value)}>
                                <option value="user">user</option>
                                <option value="admin">admin</option>
                            </select>
                        </td>
                        <td>
                            <button onClick={() => handleDeleteUser(user.id)}>Удалить</button>
                            <button onClick={() => handleBanUser(user.id)}>Заблокировать</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    ) : (
        <div>У вас нет доступа к этой странице!</div>
    );
};

export default AdminPanel;
