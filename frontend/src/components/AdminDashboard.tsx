import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { 
  Users, MessageSquare, TrendingUp, Database, Activity, Ship, Fuel, Clock, LogOut, Shield, BarChart3
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalUsers: 247,
    totalConversations: 1523,
    totalAnalyses: 3847,
    avgResponseTime: 1247,
    activeUsers: 89,
    totalVessels: 5,
  };

  const recentUsers = [
    { id: 1, username: 'demo', email: 'demo@fluxmare.ai', joined: '2024-01-15', analyses: 45 },
    { id: 2, username: 'captain_smith', email: 'smith@shipping.com', joined: '2024-02-01', analyses: 23 },
    { id: 3, username: 'marine_eng', email: 'eng@vessel.co', joined: '2024-02-10', analyses: 67 },
    { id: 4, username: 'fuel_analyst', email: 'analyst@marine.net', joined: '2024-02-15', analyses: 34 },
    { id: 5, username: 'ship_manager', email: 'manager@fleet.com', joined: '2024-03-01', analyses: 12 },
  ];

  const vesselStats = [
    { type: 'Diverse (Hỗn hợp)', count: 542, avgFuel: 124.5 },
    { type: 'MPV (Đa năng)', count: 834, avgFuel: 156.2 },
    { type: 'Tanker (Chở dầu)', count: 1023, avgFuel: 203.7 },
    { type: 'RoPax (Khách-xe)', count: 623, avgFuel: 178.9 },
    { type: 'Container', count: 825, avgFuel: 189.3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2a] to-[#0a0a1a] p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl text-white flex items-center gap-3">
              <Shield className="h-8 w-8 text-[#e3d5f7]" />
              Admin Dashboard
            </h1>
            <p className="text-[#e3d5f7]/70 mt-1">Quản lý hệ thống Fluxmare</p>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Đăng xuất
          </Button>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 border-[#e3d5f7]/30 bg-gradient-to-br from-[#1a1a2a]/95 to-[#0a0a1a]/95 backdrop-blur-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#e3d5f7] text-sm">
                <Users className="h-4 w-4" />
                Tổng người dùng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-white">{stats.totalUsers}</div>
              <p className="text-xs text-green-500 mt-1">+12 tuần này</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#e3d5f7]/30 bg-gradient-to-br from-[#1a1a2a]/95 to-[#0a0a1a]/95 backdrop-blur-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#e3d5f7] text-sm">
                <MessageSquare className="h-4 w-4" />
                Cuộc trò chuyện
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-white">{stats.totalConversations.toLocaleString()}</div>
              <p className="text-xs text-green-500 mt-1">+234 tuần này</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#e3d5f7]/30 bg-gradient-to-br from-[#1a1a2a]/95 to-[#0a0a1a]/95 backdrop-blur-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#e3d5f7] text-sm">
                <Fuel className="h-4 w-4" />
                Phân tích nhiên liệu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-white">{stats.totalAnalyses.toLocaleString()}</div>
              <p className="text-xs text-green-500 mt-1">+456 tuần này</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#e3d5f7]/30 bg-gradient-to-br from-[#1a1a2a]/95 to-[#0a0a1a]/95 backdrop-blur-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#e3d5f7] text-sm">
                <Activity className="h-4 w-4" />
                Người dùng hoạt động
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-white">{stats.activeUsers}</div>
              <p className="text-xs text-[#e3d5f7]/50 mt-1">Hiện tại online</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#e3d5f7]/30 bg-gradient-to-br from-[#1a1a2a]/95 to-[#0a0a1a]/95 backdrop-blur-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#e3d5f7] text-sm">
                <Clock className="h-4 w-4" />
                Thời gian phản hồi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-white">{stats.avgResponseTime}ms</div>
              <p className="text-xs text-[#e3d5f7]/50 mt-1">Trung bình</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#e3d5f7]/30 bg-gradient-to-br from-[#1a1a2a]/95 to-[#0a0a1a]/95 backdrop-blur-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#e3d5f7] text-sm">
                <Ship className="h-4 w-4" />
                Loại tàu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-white">{stats.totalVessels}</div>
              <p className="text-xs text-[#e3d5f7]/50 mt-1">Trong hệ thống</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#1a1a2a]/50 border-2 border-[#e3d5f7]/30">
              <TabsTrigger value="overview" className="data-[state=active]:bg-[#e3d5f7] data-[state=active]:text-black">
                <BarChart3 className="h-4 w-4 mr-2" />
                Tổng quan
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-[#e3d5f7] data-[state=active]:text-black">
                <Users className="h-4 w-4 mr-2" />
                Người dùng
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-[#e3d5f7] data-[state=active]:text-black">
                <TrendingUp className="h-4 w-4 mr-2" />
                Phân tích
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card className="border-2 border-[#e3d5f7]/30 bg-gradient-to-br from-[#1a1a2a]/95 to-[#0a0a1a]/95 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-[#e3d5f7]">Thống kê theo loại tàu</CardTitle>
                  <CardDescription className="text-[#e3d5f7]/70">
                    Số lượng phân tích và fuel consumption trung bình
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vesselStats.map((vessel, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-[#1a1a2a]/50 rounded-lg border border-[#e3d5f7]/20">
                        <div className="flex items-center gap-3">
                          <Ship className="h-5 w-5 text-[#e3d5f7]" />
                          <div>
                            <p className="text-white text-sm">{vessel.type}</p>
                            <p className="text-xs text-[#e3d5f7]/50">{vessel.count} phân tích</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[#e3d5f7]">{vessel.avgFuel} kg/h</p>
                          <p className="text-xs text-[#e3d5f7]/50">Trung bình</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <Card className="border-2 border-[#e3d5f7]/30 bg-gradient-to-br from-[#1a1a2a]/95 to-[#0a0a1a]/95 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-[#e3d5f7]">Người dùng gần đây</CardTitle>
                  <CardDescription className="text-[#e3d5f7]/70">
                    Danh sách người dùng mới và hoạt động
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {recentUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-[#1a1a2a]/50 rounded-lg border border-[#e3d5f7]/20 hover:border-[#e3d5f7]/40 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#e3d5f7]/20 flex items-center justify-center">
                              <Users className="h-5 w-5 text-[#e3d5f7]" />
                            </div>
                            <div>
                              <p className="text-white text-sm">{user.username}</p>
                              <p className="text-xs text-[#e3d5f7]/50">{user.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[#e3d5f7] text-sm">{user.analyses} phân tích</p>
                            <p className="text-xs text-[#e3d5f7]/50">{user.joined}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <Card className="border-2 border-[#e3d5f7]/30 bg-gradient-to-br from-[#1a1a2a]/95 to-[#0a0a1a]/95 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-[#e3d5f7]">Thống kê phân tích</CardTitle>
                  <CardDescription className="text-[#e3d5f7]/70">
                    Chi tiết về các phân tích nhiên liệu
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Database className="h-16 w-16 text-[#e3d5f7]/50 mx-auto mb-4" />
                    <p className="text-[#e3d5f7]/70">Dữ liệu phân tích chi tiết sẽ được hiển thị tại đây</p>
                    <p className="text-[#e3d5f7]/50 text-sm mt-2">Tính năng đang được phát triển...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
