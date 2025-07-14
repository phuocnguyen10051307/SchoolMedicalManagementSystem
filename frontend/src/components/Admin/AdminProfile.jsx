import avatarImg from './avatar.jpg';
import './AdminProfileModal.scss';

const AdminProfile = () => {
  return (
    <div className="admin-profile-page">
      <h2 className="title">Admin Profile</h2>
      <img className='avatar' src={avatarImg} alt="Avatar" />
      <p>Username: jackbocon</p>
      <p>Email: jackbocon@gmail.com</p>
    </div>
  );
};

export default AdminProfile;
