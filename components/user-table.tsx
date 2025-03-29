"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import type { User } from "@/types/user"
import { motion } from "framer-motion"

interface UserTableProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="rounded-xl border border-gray-800 overflow-hidden backdrop-blur-sm">
      <Table>
        <TableHeader className="bg-gray-900/50">
          <TableRow className="border-gray-800 hover:bg-transparent">
            <TableHead className="text-gray-400">Avatar</TableHead>
            <TableHead className="text-gray-400">Name</TableHead>
            <TableHead className="text-gray-400">Email</TableHead>
            <TableHead className="text-gray-400 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <motion.tr
              key={user.id}
              className="border-gray-800 bg-gray-900/30 hover:bg-gray-800/50 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TableCell>
                <Avatar>
                  <AvatarImage src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white">
                    {user.first_name[0]}
                    {user.last_name[0]}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium text-white">
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell className="text-gray-400">{user.email}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(user)}
                    className="text-gray-400 hover:text-purple-400 hover:bg-gray-800"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(user)}
                    className="text-gray-400 hover:text-red-400 hover:bg-gray-800"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

