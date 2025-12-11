// src/components/Admin/Request.js

const Request = ({ request, index, handleApprove, handleReject }) => {
    return (
        <tr>
            <td className="bg-white">{index + 1}</td>
            <td className="bg-white">{request.first_name} {request.last_name}</td>
            <td className="bg-white">{request.email}</td>
            <td className="bg-white">{request.designation}</td>
            <td className="bg-white">
                <img src={request.img_link} alt="instructor-img" className="w-16 rounded" />
            </td>
            <td className="bg-white">
                <select
                    value={request.status || "pending"} // default fallback
                    onChange={(e) => {
                        if (e.target.value === "approve") {
                            handleApprove(request);
                        } else if (e.target.value === "reject") {
                            handleReject(request);
                        }
                    }}
                    className="select select-bordered select-sm max-w-xs bg-white"
                >
                    <option value="pending" disabled>Select action</option>
                    <option value="approve">Approved</option>
                    <option value="reject">Reject</option>
                </select>
            </td>
        </tr>
    );
};

export default Request;
