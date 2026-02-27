import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGameSlots, { type GameSlot } from "./hooks/useGameSlots";
import useCreateBooking from "./hooks/useCreateBooking";
interface UserBookingDetail {
    userId: number;
    status: string; 
    message: string;
}
interface BookingResultDto {
    userResults: UserBookingDetail[];
    bookedUsers: number[];
    waitingUsers: number[];
}
const GameDetails = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [bookingResults, setBookingResults] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<GameSlot | null>(null);
  const [userIds, setUserIds] = useState<number[]>([0]);
  const [displayMessage, notifyUser] = useState<string | null>(null);

  const loggedInUserId = localStorage.getItem('id');

  const gameIdNum = gameId ? parseInt(gameId) : undefined;
  // const isoDate = new Date(selectedDate).toISOString();
  const { data: slots , isLoading , isError } = useGameSlots(gameId , selectedDate);
  console.log(slots);
  console.log(gameId , gameIdNum);
  const createBookingMutation = useCreateBooking();

  const handleAddUser = () => {
    setUserIds([...userIds, 0]);
  };

  const handleUserChange = (index: number, value: string) => {
    const updated = [...userIds];
    updated[index] = parseInt(value) || 0;
    setUserIds(updated);
  };

  const handleSubmit = async () => {
    if (!selectedSlot) return;

    const filteredUsers = userIds.filter(id => id > 0);

    if (filteredUsers.length === 0) {
      notifyUser("Please enter at least one valid user ID.");
      return;
    }

    try {
      const result = await createBookingMutation.mutateAsync({
        SlotId: selectedSlot.id,
        BookedBy: Number(loggedInUserId),
        Status: "Pending", 
        userIds: filteredUsers
      });
      setBookingResults(result.userResults || []);
      notifyUser(null);
      setUserIds([0]);
    } catch (error: any) {
      notifyUser(error?.response?.data || "Booking failed ");
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    const day = date.getDay();
    if (day === 0 || day === 6) {
      alert("Only Monday to Friday allowed.");
      return;
    }
    setSelectedDate(e.target.value);
  };

  return (
    <div className="p-6">
      <button onClick={() => navigate("/employee/games")} className="mb-4 text-blue-600 underline">Back</button>

      <h1 className="text-xl font-bold mb-4">Book Slot</h1>

      <input type="date" value={selectedDate} onChange={handleDateChange} className="border p-2 rounded mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {slots?.map((slot) => (
          <div key={slot.id} onClick={() => setSelectedSlot(slot)} className="border rounded p-4 shadow hover:bg-gray-50 cursor-pointer">
             <div><strong>Capacity:</strong> {slot.id}</div>
            <div><strong>Available:</strong> {slot.capacity - slot.assigned}</div>
            <div><strong>Capacity:</strong> {slot.capacity}</div>
            <div><strong>Start:</strong> {slot.startTime}</div>
            <div><strong>End:</strong> {new Date(slot.endTime).toLocaleTimeString()}</div>
            <div><strong>Status:</strong> {slot.isBookingOpen ? "Open" : "Closed"}</div>
          </div>
        ))}
      </div>

      {bookingResults.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded border max-h-40 overflow-y-auto">
          <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">Booking Status:</h3>
          <ul className="space-y-2">
            {bookingResults.map((res, index) => (
              <li key={index} className="text-sm flex justify-between items-center">
                <span className="font-medium">User {res.userId}:</span>
                <span className={
                  res.status === "Booked" ? "text-green-600" : 
                  res.status === "Waiting" ? "text-yellow-600" : "text-red-600"
                }>
                  {res.message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white w-full max-w-lg p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-3">Slot Details</h2>

            <div className="text-sm mb-4 space-y-1">
              <div>Capacity: {selectedSlot.capacity}</div>
              <div>Assigned: {selectedSlot.assigned}</div>
              <div>Available: {selectedSlot.capacity - selectedSlot.assigned}</div>
              <div>Booking Open: {selectedSlot.isBookingOpen ? "Yes" : "No"}</div>
            </div>

            {!selectedSlot.isBookingOpen && <div className="text-red-600 text-sm mb-3">Booking is closed for this slot.</div>}
            {selectedSlot.availableSeats === 0 && <div className="text-yellow-600 text-sm mb-3">Slot is full. You will be added to queue.</div>}

            <div className="space-y-3">
              {userIds.map((id, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input type="number" value={id || ""} placeholder="Enter User ID" onChange={(e) => handleUserChange(index, e.target.value)} className="flex-1 border p-2 rounded" />
                </div>
              ))}
            </div>

            <button onClick={handleAddUser} className="mt-3 text-blue-600 text-sm underline">+ Add User</button>

            {displayMessage && <div className="mt-4 text-sm text-blue-600">{displayMessage}</div>}

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setSelectedSlot(null); setBookingResults([]); }} className="px-4 py-2 bg-gray-200 rounded"> Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">
                {createBookingMutation.isPending ? "Processing" : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameDetails;