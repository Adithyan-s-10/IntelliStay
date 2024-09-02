import './ManagerPanel.css';
import Sidebar from './layout/Sidebar/Sidebar';
import Content from './layout/Content/Content';

function ManagerPanel() {
  return (
    <>
      <div className='app'>
        <Sidebar />
        <Content />
      </div>
    </>
  )
}

export default ManagerPanel