// // import { useEffect, useState } from "react";
// // import { Users, Building2, MessageSquareWarning, ScrollText, UserCheck } from "lucide-react";
// // import { useAuth } from "../context/AuthContext";
// // import DashboardLayout from "../components/DashboardLayout";
// // import Card from "../components/Card";
// // import * as resourceService from "../services/resourceService";
// // import toast from "react-hot-toast";



// import {
//   Users,
//   Building2,
//   MessageSquareWarning,
//   ScrollText,
//   UserCheck,
//   Clock,
//   DoorOpen,
//   CheckCircle2,
//   XCircle,
//   LogOut,
// } from "lucide-react";

// const AdminDashboard = () => {
//   const [stats, setStats] = useState(null);

//   useEffect(() => {
//     resourceService
//       .getAdminStats()
//       .then((res) => setStats(res.data.stats))
//       .catch(() => toast.error("Could not load dashboard stats"));
//   }, []);


//   if (!stats) return <p className="text-ink/50">Loading stats...</p>;

//   return (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
//         <Card title="Total Residents" value={stats.totalResidents} icon={Users} accent="primary" />
//         <Card title="Total Flats" value={stats.totalFlats} icon={Building2} accent="primary" />
//         <Card
//           title="Pending Complaints"
//           value={stats.pendingComplaints}
//           icon={MessageSquareWarning}
//           accent="danger"
//         />
//         <Card title="Active Notices" value={stats.activeNotices} icon={ScrollText} accent="accent" />
//         <Card title="Visitors Today" value={stats.visitorsToday} icon={UserCheck} accent="success" />
//       </div>

//       <div>
//         <p className="mb-2 text-sm font-medium text-ink/50">Visitor Management</p>
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           <Card title="Pending Approval" value={stats.pendingVisitorApprovals} icon={Clock} accent="danger" />
//           <Card title="Currently Inside" value={stats.visitorsInsideNow} icon={DoorOpen} accent="primary" />
//           <Card title="Approved Today" value={stats.approvedVisitorsToday} icon={CheckCircle2} accent="success" />
//           <Card title="Rejected Today" value={stats.rejectedVisitorsToday} icon={XCircle} accent="danger" />
//         </div>
//       </div>
//     </div>
//   );
// };

// //   if (!stats) return <p className="text-ink/50">Loading stats...</p>;

// //   return (
// //     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
// //       <Card title="Total Residents" value={stats.totalResidents} icon={Users} accent="primary" />
// //       <Card title="Total Flats" value={stats.totalFlats} icon={Building2} accent="primary" />
// //       <Card
// //         title="Pending Complaints"
// //         value={stats.pendingComplaints}
// //         icon={MessageSquareWarning}
// //         accent="danger"
// //       />
// //       <Card title="Active Notices" value={stats.activeNotices} icon={ScrollText} accent="accent" />
// //       <Card title="Visitors Today" value={stats.visitorsToday} icon={UserCheck} accent="success" />
// //     </div>
// //   );
// // };

// const MemberOrGuardDashboard = ({ role }) => (
//   <div className="rounded-lg border border-border bg-panel p-8 text-center">
//     <h3 className="font-display text-lg font-semibold text-ink">
//       Welcome to your {role === "guard" ? "security" : "resident"} dashboard
//     </h3>
//     <p className="mt-2 text-sm text-ink/50">
//       Use the sidebar to {role === "guard" ? "verify visitors" : "view notices, raise complaints, and check your maintenance bills"}.
//     </p>
//   </div>
// );

// const Dashboard = () => {
//   const { user } = useAuth();

//   return (
//     <DashboardLayout title="Dashboard">
//       {user?.role === "admin" ? (
//         <AdminDashboard />
//       ) : (
//         <MemberOrGuardDashboard role={user?.role} />
//       )}
//     </DashboardLayout>
//   );
// };

// export default Dashboard;







import { useEffect, useState } from "react";
import {
  Users,
  Building2,
  MessageSquareWarning,
  ScrollText,
  UserCheck,
  Clock,
  DoorOpen,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import Card from "../components/Card";
import * as resourceService from "../services/resourceService";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    resourceService
      .getAdminStats()
      .then((res) => setStats(res.data.stats))
      .catch(() => toast.error("Could not load dashboard stats"));
  }, []);

  if (!stats) return <p className="text-ink/50">Loading stats...</p>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card title="Total Residents" value={stats.totalResidents} icon={Users} accent="primary" />
        <Card title="Total Flats" value={stats.totalFlats} icon={Building2} accent="primary" />
        <Card
          title="Pending Complaints"
          value={stats.pendingComplaints}
          icon={MessageSquareWarning}
          accent="danger"
        />
        <Card title="Active Notices" value={stats.activeNotices} icon={ScrollText} accent="accent" />
        <Card title="Visitors Today" value={stats.visitorsToday} icon={UserCheck} accent="success" />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink/50">Visitor Management</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card title="Pending Approval" value={stats.pendingVisitorApprovals} icon={Clock} accent="danger" />
          <Card title="Currently Inside" value={stats.visitorsInsideNow} icon={DoorOpen} accent="primary" />
          <Card
            title="Approved Today"
            value={stats.approvedVisitorsToday}
            icon={CheckCircle2}
            accent="success"
          />
          <Card title="Rejected Today" value={stats.rejectedVisitorsToday} icon={XCircle} accent="danger" />
        </div>
      </div>
    </div>
  );
};

const MemberOrGuardDashboard = ({ role }) => (
  <div className="rounded-lg border border-border bg-panel p-8 text-center">
    <h3 className="font-display text-lg font-semibold text-ink">
      Welcome to your {role === "guard" ? "security" : "resident"} dashboard
    </h3>
    <p className="mt-2 text-sm text-ink/50">
      Use the sidebar to{" "}
      {role === "guard"
        ? "verify visitors"
        : "view notices, raise complaints, and check your maintenance bills"}
      .
    </p>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout title="Dashboard">
      {user?.role === "admin" ? <AdminDashboard /> : <MemberOrGuardDashboard role={user?.role} />}
    </DashboardLayout>
  );
};

export default Dashboard;