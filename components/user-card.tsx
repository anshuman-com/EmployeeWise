"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Mail } from "lucide-react"
import type { User } from "@/types/user"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import { CardSpotlight } from "@/components/ui/card-spotlight"

interface UserCardProps {
  user: User
  onEdit: () => void
  onDelete: () => void
}

export default function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <CardSpotlight className="group">
      <div className="h-28 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-t-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/80 to-transparent"></div>
      </div>
      <div className="p-6 -mt-16 relative z-10">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 border-4 border-black shadow-xl">
            <AvatarImage src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
            <AvatarFallback className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white text-xl">
              {user.first_name[0]}
              {user.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <h3 className="mt-4 text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-pink-500 group-hover:to-blue-500 transition-all duration-300">
            {user.first_name} {user.last_name}
          </h3>
          <div className="mt-1 flex items-center text-sm text-gray-400">
            <Mail size={14} className="mr-1" />
            {user.email}
          </div>
        </div>
      </div>
      <div className="flex justify-between p-6 pt-0">
        <HoverBorderGradient containerClassName="rounded-full" className="rounded-full" as="button" onClick={onEdit}>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-gray-300 hover:text-purple-400 transition-colors rounded-full"
          >
            <Edit size={14} />
            <span>Edit</span>
          </Button>
        </HoverBorderGradient>

        <HoverBorderGradient
          containerClassName="rounded-full"
          className="rounded-full"
          as="button"
          onClick={onDelete}
          borderClassName="bg-gradient-to-r from-red-500 to-pink-500"
        >
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-gray-300 hover:text-red-400 transition-colors rounded-full"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </Button>
        </HoverBorderGradient>
      </div>
    </CardSpotlight>
  )
}

