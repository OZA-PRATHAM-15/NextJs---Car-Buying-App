import CarCard from "./CarCard";
const ListView = ({ cars }) => (
    <div>
        {cars.map((car) => <CarCard key={car._id} car={car} />)}
    </div>
);

export default ListView;
