const ViewToggle = ({ currentView, setView }) => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button onClick={() => setView('grid')}>Grid View</button>
        <button onClick={() => setView('list')}>List View</button>
    </div>
);

export default ViewToggle;
