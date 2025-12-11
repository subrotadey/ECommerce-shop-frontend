import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../../Shared/ConfirmationModal/ConfirmationModal";
import Loading from "../../Shared/Loading/Loading";
import Request from "./Request";

const InstructorRequests = () => {
    const [deletingRequest, setDeletingRequest] = useState(null);
    const closeModal = () => {
        setDeletingRequest(null);
    };

    const {
        data: requests,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["instructorRequests"],
        queryFn: async () => {
            try {
                const res = await fetch("https://e-learning-server-hazel.vercel.app/instructor-requests", {
                    headers: {
                        authorization: `bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                const data = await res.json();
                return data;
            } catch (error) {
                console.error("Error fetching requests:", error);
            }
        },
    });

    // Approve Handler
    const handleApprove = async (request) => {
        if (request.status === "approved") {
            toast.success(`${request.first_name} is already approved.`);
            return;
        }
        const teacher = {
            first_name: request.first_name,
            last_name: request.last_name,
            email: request.email,
            designation: request.designation,
            description: request.description,
            img_link: request.img_link,
            role: "instructor",
            status: "approved",
        };

        try {
            // Add to teachers collection
            const addRes = await fetch("https://e-learning-server-hazel.vercel.app/teachers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify(teacher),
            });
            const addResult = await addRes.json();

            if (addResult.insertedId) {
                // Update request status to approved
                const updateRes = await fetch(
                    `https://e-learning-server-hazel.vercel.app/instructor-requests/${request._id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `bearer ${localStorage.getItem("accessToken")}`,
                        },
                        body: JSON.stringify({ status: "approved" }),
                    }
                );
                const updateResult = await updateRes.json();

                if (updateResult.modifiedCount > 0) {
                    toast.success(`${request.first_name} is now an instructor!`);
                    refetch();
                } else {
                    toast.error("Failed to update request status.");
                }
            } else {
                toast.error("Failed to add teacher.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error during approval.");
        }
    };

    // Reject Handler
    const handleReject = async (request) => {
        try {
            const deleteRes = await fetch(
                `https://e-learning-server-hazel.vercel.app/instructor-requests/${request._id}`,
                {
                    method: "DELETE",
                    headers: {
                        authorization: `bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            const deleteResult = await deleteRes.json();

            if (deleteResult.deletedCount > 0) {
                toast.success(`${request.first_name}'s request rejected and deleted.`);
                refetch();
            } else {
                toast.error("Failed to delete request.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error during rejection.");
        }
    };

    if (isLoading) return <Loading />;

    return (
        <section className="w-11/12 mx-auto pt-12">
            <h2 className="text-3xl mb-4 text-center">
                Instructor Requests: {requests?.length}
            </h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th className="bg-white">Serial</th>
                            <th className="bg-white">Name</th>
                            <th className="bg-white">Email</th>
                            <th className="bg-white">Designation</th>
                            <th className="bg-white">Photo</th>
                            <th className="bg-white">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests?.map((request, i) => (
                            <Request
                                key={request._id}
                                request={request}
                                index={i}
                                handleApprove={handleApprove}
                                handleReject={handleReject}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {deletingRequest && (
                <ConfirmationModal
                    title={`Are you sure want to delete this request?`}
                    message={`Deleting ${deletingRequest.first_name}'s request cannot be undone.`}
                    successAction={() => handleReject(deletingRequest)}
                    successButtonName="Delete"
                    modalData={deletingRequest}
                    closeModal={closeModal}
                />
            )}
        </section>
    );
};

export default InstructorRequests;
