import { MapPin } from 'lucide-react';

const Addresses = () => {
    return (
        <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">My Addresses</h2>
                            <button className="btn btn-primary">Add New Address</button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                { type: 'Home', default: true },
                                { type: 'Office', default: false }
                            ].map((address, idx) => (
                                <div key={idx} className="card shadow-md hover:shadow-lg transition-shadow">
                                    <div className="card-body">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-2 items-center">
                                                <MapPin className="w-5 h-5 text-primary" />
                                                <h3 className="font-semibold text-lg">{address.type}</h3>
                                            </div>
                                            {address.default && (
                                                <span className="badge badge-primary badge-sm">Default</span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-2 space-y-1">
                                            <p>John Doe</p>
                                            <p>House 123, Road 45</p>
                                            <p>Chittagong, Bangladesh</p>
                                            <p>Phone: +880 1234-567890</p>
                                        </div>
                                        <div className="card-actions justify-end mt-3">
                                            <button className="btn btn-sm btn-ghost">Edit</button>
                                            <button className="btn btn-sm btn-ghost text-error">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
    );
};

export default Addresses;