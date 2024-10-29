import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ component: Component, ...rest }) => {
    const userRole = useSelector(state => state.role.role);

    return (
        <Route
            {...rest}
            render={props =>
                userRole === 'admin' ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/unauthorized" />
                )
            }
        />
    );
};

export default AdminRoute;
