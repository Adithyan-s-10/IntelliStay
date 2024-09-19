import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const useAuth = () => {
  const history = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem('userId');

    if (!id) {
      history('/signup');
      // Optionally show a session expired message
      Swal.fire('Session expired. Please log in again.');
    }
    
  }, [history]);
};

export default useAuth;
