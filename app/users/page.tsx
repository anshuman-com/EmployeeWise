"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Loader2, Search, LogOut, LayoutGrid, LayoutList } from "lucide-react"
import UserCard from "@/components/user-card"
import UserTable from "@/components/user-table"
import EditUserForm from "@/components/edit-user-form"
import type { User } from "@/types/user"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import { Spotlight } from "@/components/ui/spotlight"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    fetchUsers(currentPage)
  }, [currentPage, router])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(
        (user) =>
          user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredUsers(filtered)
    }
  }, [searchQuery, users])

  const fetchUsers = async (page: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://reqres.in/api/users?page=${page}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      setUsers(data.data)
      setFilteredUsers(data.data)
      setTotalPages(data.total_pages)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteUser = async () => {
    if (!selectedUser) return

    setIsDeleteLoading(true)
    try {
      const response = await fetch(`https://reqres.in/api/users/${selectedUser.id}`, {
        method: "DELETE",
      })

      if (!response.ok && response.status !== 204) {
        throw new Error("Failed to delete user")
      }

      // Remove user from the list
      setUsers(users.filter((user) => user.id !== selectedUser.id))
      setFilteredUsers(filteredUsers.filter((user) => user.id !== selectedUser.id))

      toast({
        title: "User deleted",
        description: `${selectedUser.first_name} ${selectedUser.last_name} has been deleted successfully`,
      })

      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user",
        variant: "destructive",
      })
    } finally {
      setIsDeleteLoading(false)
    }
  }

  const updateUser = (updatedUser: User) => {
    const updatedUsers = users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    setUsers(updatedUsers)
    setFilteredUsers(updatedUsers)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <BackgroundGradientAnimation>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10" />
        <div className="relative z-20 min-h-screen">
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

          <header className="border-b border-gray-800 backdrop-blur-md bg-black/40 sticky top-0 z-30">
            <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
                EmployWise User Management
              </h1>
              <div className="flex items-center gap-4">
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  className="rounded-full"
                  as="button"
                  onClick={handleLogout}
                >
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-white hover:text-red-400 transition-colors rounded-full"
                  >
                    <LogOut size={16} />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </HoverBorderGradient>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
                  Users
                </h2>
                <Tabs defaultValue="grid" className="ml-4">
                  <TabsList className="bg-gray-900/50 border border-gray-800">
                    <TabsTrigger
                      value="grid"
                      onClick={() => setViewMode("grid")}
                      className="data-[state=active]:bg-gray-800"
                    >
                      <LayoutGrid size={16} />
                    </TabsTrigger>
                    <TabsTrigger
                      value="list"
                      onClick={() => setViewMode("list")}
                      className="data-[state=active]:bg-gray-800"
                    >
                      <LayoutList size={16} />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-900/50 border-gray-800 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full border-t-2 border-b-2 border-purple-500 animate-spin"></div>
                  <div
                    className="h-24 w-24 rounded-full border-r-2 border-l-2 border-pink-500 animate-spin absolute top-0 left-0"
                    style={{ animationDirection: "reverse", animationDuration: "1s" }}
                  ></div>
                </div>
              </div>
            ) : (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                      {filteredUsers.map((user) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                        >
                          <UserCard
                            user={user}
                            onEdit={() => handleEditUser(user)}
                            onDelete={() => handleDeleteUser(user)}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <UserTable users={filteredUsers} onEdit={handleEditUser} onDelete={handleDeleteUser} />
                )}

                {filteredUsers.length === 0 && !isLoading && (
                  <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800 backdrop-blur-sm">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-800/50 mb-4">
                        <Search className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-300 mb-2">No users found</h3>
                      <p className="text-gray-500">No users found matching your search criteria.</p>
                    </motion.div>
                  </div>
                )}

                {filteredUsers.length > 0 && searchQuery === "" && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="bg-gray-900/50 border-gray-800 hover:bg-gray-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="m15 18-6-6 6-6"></path>
                        </svg>
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="icon"
                          onClick={() => handlePageChange(page)}
                          className={
                            currentPage === page
                              ? "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 border-none"
                              : "bg-gray-900/50 border-gray-800 hover:bg-gray-800"
                          }
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="bg-gray-900/50 border-gray-800 hover:bg-gray-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="m9 18 6-6-6-6"></path>
                        </svg>
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>

          {/* Edit User Dialog */}
          {selectedUser && (
            <EditUserForm
              user={selectedUser}
              isOpen={isEditDialogOpen}
              onClose={() => setIsEditDialogOpen(false)}
              onUserUpdated={updateUser}
            />
          )}

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="sm:max-w-md bg-gray-900 border border-gray-800 text-white">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Are you sure you want to delete {selectedUser?.first_name} {selectedUser?.last_name}? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="border-gray-700 hover:bg-gray-800 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDeleteUser}
                  disabled={isDeleteLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleteLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete User"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </BackgroundGradientAnimation>
    </div>
  )
}

