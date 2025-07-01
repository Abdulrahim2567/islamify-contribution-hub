import React from "react";
import AdminContributionsTable from "../contribution/AdminContributionsTable";
import { Member } from "@/types/types";

interface ContributionsProps {
	thisAdminMember: Member;
}

const Contributions: React.FC<ContributionsProps> = ({ thisAdminMember }) => {
	return (
		<React.Suspense fallback={<div>Loading...</div>}>
			<AdminContributionsTable currentUser={thisAdminMember} />
		</React.Suspense>
	);
};

export default Contributions;
