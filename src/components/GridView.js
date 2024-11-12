import CarCard from "./CarCard";
const GridView = ({ cars }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {cars.map((car) => <CarCard key={car._id} car={car} />)}
    </div>
);

export default GridView;
