
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Coins } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";

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
  <div className="space-y-4">
    {/* Desktop Table View */}
    <div className="hidden md:block">
      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80">
              <TableHead className="font-semibold text-gray-700">Member</TableHead>
              <TableHead className="font-semibold text-gray-700">Amount (XAF)</TableHead>
              <TableHead className="font-semibold text-gray-700">Date</TableHead>
              <TableHead className="font-semibold text-gray-700">Description</TableHead>
              <TableHead className="font-semibold text-gray-700">By</TableHead>
              <TableHead className="font-semibold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Coins className="w-8 h-8 text-gray-300" />
                    <span>No contributions yet.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {data.map((rec, idx) => (
              <TableRow key={idx} className="hover:bg-gray-50/50">
                <TableCell className="font-medium text-gray-900">{rec.memberName}</TableCell>
                <TableCell className="text-emerald-600 font-semibold">{rec.amount.toLocaleString()}</TableCell>
                <TableCell className="text-gray-700">{new Date(rec.date).toLocaleDateString()}</TableCell>
                <TableCell className="text-gray-600">{rec.description || "-"}</TableCell>
                <TableCell className="text-gray-600">{rec.performedBy}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 text-xs"
                      onClick={() => onEdit(rec)}
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex items-center gap-1 text-xs"
                      onClick={() => onDelete(rec)}
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>

    {/* Mobile Card View */}
    <div className="md:hidden space-y-3">
      {data.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            <div className="flex flex-col items-center gap-3">
              <Coins className="w-12 h-12 text-gray-300" />
              <span>No contributions yet.</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        data.map((rec, idx) => (
          <Card key={idx} className="border-l-4 border-l-emerald-500">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{rec.memberName}</h3>
                    <p className="text-2xl font-bold text-emerald-600">{rec.amount.toLocaleString()} XAF</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {new Date(rec.date).toLocaleDateString()}
                  </div>
                </div>
                
                {rec.description && (
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Description:</p>
                    <p className="text-sm text-gray-800">{rec.description}</p>
                  </div>
                )}
                
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Performed by:</span> {rec.performedBy}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 text-xs flex-1"
                    onClick={() => onEdit(rec)}
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex items-center gap-1 text-xs flex-1"
                    onClick={() => onDelete(rec)}
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>

    {/* Pagination */}
    {totalPages > 1 && (
      <div className="flex justify-center py-4">
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
