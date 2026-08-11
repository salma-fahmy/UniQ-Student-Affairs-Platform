import { useAuth as useAuthContext } from '../../store/authContext.js';

const useAuth = () => useAuthContext();

export default useAuth;
export { useAuth };
