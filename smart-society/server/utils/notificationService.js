/**
 * Lightweight, provider-agnostic notification dispatcher.
 *
 * Today this only logs to the console. When you're ready to add real-time
 * delivery, swap the body of each function for a Socket.IO emit (e.g.
 * `io.to(`user:${residentId}`).emit("visitor:new", visitor)`) or a Firebase
 * push call - no controller code needs to change, since controllers only
 * ever call these two functions.
 */

const notifyResident = (residentId, visitor) => {
  console.log(
    `[notify] Resident ${residentId}: new visitor request from "${visitor.visitorName}" awaiting approval`
  );
  // TODO (Socket.IO): io.to(`user:${residentId}`).emit("visitor:new", visitor);
  // TODO (Firebase): send push notification to resident's device token
};

const notifyGuards = (visitor, event) => {
  console.log(`[notify] Security desk: visitor "${visitor.visitorName}" was ${event}`);
  // TODO (Socket.IO): io.to("role:guard").emit(`visitor:${event}`, visitor);
};

module.exports = { notifyResident, notifyGuards };