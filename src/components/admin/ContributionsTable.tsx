
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Coins } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface ContributionRecord {
  type: "contribution";
  amount: number;
  memberId: number;
  memberName: string;
  date: string;
  performedBy: string;
  description?: string;
}

interface ContributionsTableProps {
  data: ContributionRecord[];
  page: number;
  totalPages: number;
  onEdit: (rec: ContributionRecord) => void;
  onDelete: (rec: ContributionRecord) => void;
  onPageChange: (page: number) => void;
}

const ContributionsTable: React.FC<ContributionsTableProps> = ({
  data,
  page,
  totalPages,
  onEdit,
  onDelete,
  onPageChange,
}) => (
  <div className="overflow-x-auto rounded-lg border border-gray-100 bg-gray-50">
    <table className="min-w-full text-sm divide-y divide-gray-100">
      <thead>
        <tr className="bg-gray-100">
          <th className="py-3 px-4 text-left">Member</th>
          <th className="py-3 px-4 text-left">Amount (XAF)</th>
          <th className="py-3 px-4 text-left">Date</th>
          <th className="py-3 px-4 text-left">Description</th>
          <th className="py-3 px-4 text-left">By</th>
          <th className="py-3 px-4 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 && (
          <tr>
            <td colSpan={6} className="py-8 text-center text-gray-400">
              No contributions yet.
            </td>
          </tr>
        )}
        {data.map((rec, idx) => (
          <tr key={idx} className="border-b last:border-b-0 bg-white">
            <td className="py-3 px-4 font-medium text-gray-900">{rec.memberName}</td>
            <td className="py-3 px-4 text-cyan-700 font-semibold">{rec.amount.toLocaleString()}</td>
            <td className="py-3 px-4 text-gray-700">{new Date(rec.date).toLocaleDateString()}</td>
            <td className="py-3 px-4">{rec.description || "-"}</td>
            <td className="py-3 px-4 text-gray-600">{rec.performedBy}</td>
            <td className="py-2 px-4">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => onEdit(rec)}
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex items-center gap-2"
                  onClick={() => onDelete(rec)}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Pagination */}
    {totalPages > 1 && (
      <div className="flex justify-center py-3 border-t border-gray-100 bg-white/90 sticky bottom-0 z-10">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={page === 1}
                tabIndex={page === 1 ? -1 : 0}
                onClick={e => {
                  e.preventDefault();
                  if (page > 1) onPageChange(page - 1);
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={page === i + 1}
                  onClick={e => {
                    e.preventDefault();
                    onPageChange(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={page === totalPages}
                tabIndex={page === totalPages ? -1 : 0}
                onClick={e => {
                  e.preventDefault();
                  if (page < totalPages) onPageChange(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    )}
  </div>
);

export default ContributionsTable;
