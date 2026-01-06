import { Package } from 'lucide-react';

const Orders = () => {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
            <div className="space-y-3">
                {[1, 2, 3].map((order) => (
                    <div key={order} className="card shadow-md hover:shadow-lg transition-shadow">
                        <div className="card-body">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <Package className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Order #{1000 + order}</h3>
                                        <p className="text-sm text-gray-600">Placed on Dec {order}, 2025</p>
                                        <p className="text-sm text-gray-600">3 items</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">${2500 + order * 500}</p>
                                    <span className="badge badge-success badge-sm">Delivered</span>
                                </div>
                            </div>
                            <div className="card-actions justify-end mt-2">
                                <button className="btn btn-sm btn-outline">View Details</button>
                                <button className="btn btn-sm btn-primary">Reorder</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;