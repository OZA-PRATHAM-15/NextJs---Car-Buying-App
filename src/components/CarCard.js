const CarCard = ({ car }) => (
    <div style={{ border: '1px solid #ff0000', padding: '20px', marginBottom: '20px' }}>
        <img src={car.image} alt={car.name} style={{ width: '100%', height: 'auto' }} />
        <h3>{car.name}</h3>
        <p>{car.description}</p>
        <p><strong>Price:</strong> ${car.price}</p>
        <button>More</button>
    </div>
);

export default CarCard;
