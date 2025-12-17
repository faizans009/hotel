import hotelImg from '../../../assets/hotels.jpeg';
import boutiqueImg from '../../../assets/boutique.jpg';
import resortImg from '../../../assets/resort.jpeg';
import apartmentImg from '../../../assets/apartment.jpeg';

const PropertyTypes = () => {
    const propertyTypes = [
        {
            id: 1,
            name: 'Hotels',
            image: hotelImg,
            gradient: 'from-blue-600 to-blue-900',
            description: 'Modern rooms with luxury amenities'
        },
        {
            id: 2,
            name: 'Boutique hotels',
            image: boutiqueImg,
            gradient: 'from-purple-600 to-purple-900',
            description: 'Unique designs and personalized service'
        },
        {
            id: 3,
            name: 'Resort',
            image: resortImg,
            gradient: 'from-green-600 to-green-900',
            description: 'All-inclusive vacation destinations'
        },
        {
            id: 4,
            name: 'Apartment hotels',
            image: apartmentImg,
            gradient: 'from-amber-600 to-amber-900',
            description: 'Spacious living with kitchen facilities'
        }
    ];

    return (
        <div className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-1">Property Types</h2>
                <p className="text-gray-500 mb-8">Choose from our wide variety of accommodations</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {propertyTypes.map((property) => (
                        <div
                            key={property.id}
                            className="group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${property.gradient}`}>
                                <img
                                    src={property.image}
                                    alt={property.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-white text-2xl font-bold text-center px-4">
                                        {property.name}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PropertyTypes;
