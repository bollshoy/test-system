import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {collection, getDocs, updateDoc, doc, deleteDoc} from 'firebase/firestore';
import Loading from "@/components/Loading/Loading.jsx";
import {fetchUserRole} from "../../redux/action/roleAction.js";
import {toast} from 'react-toastify';
import {db} from '/firebase';
import './_AdminPanel.scss';

const AdminPanel = () => {
    const dispatch = useDispatch();
    const userRole = useSelector(state => state.role.role);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserRole = async () => {
            await dispatch(fetchUserRole());
        };
        getUserRole();
    }, [dispatch]);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, 'User'));
                const userList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUsers(userList);
            } catch (error) {
                console.error('Ошибка при загрузке пользователей:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateDoc(doc(db, 'User', userId), {role: newRole});
            setUsers(prevUsers => prevUsers.map(user => user.id === userId ? {...user, role: newRole} : user));
            toast.success('Роль успешно обновлена!');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Ошибка при обновлении роли');
        }
    };

    const handleDeleteUser = async (userId) => {
        const userRef = doc(db, 'User', userId);
        await deleteDoc(userRef);
        setUsers(users.filter(user => user.id !== userId));
    };

    if (loading) {
        return <Loading/>;
    }

    return userRole === 'admin' ? (
        <div className={'adminPanel'}>
            <div className="adminPanel__container container">
                <h3 className={'adminPanel__title'}>Админ-панель</h3>
                <div className="adminPanel__content">
                    <table className={'adminPanel__table'}>
                        <thead>
                        <tr>
                            <th>Email</th>
                            <th>Ім'я та прізвище</th>
                            <th>Роль</th>
                            <th>Дія</th>
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
                                    <button onClick={() => handleDeleteUser(user.id)}>Видалити</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    ) : (
        <div>У вас нет доступа к этой странице!</div>
    );
};

export default AdminPanel;
