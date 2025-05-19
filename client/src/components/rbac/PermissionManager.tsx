import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResourceManager } from "./ResourceManager";
import { RolePermissions } from "./RolePermissions";
import { UserPermissions } from "./UserPermissions";

export function PermissionManager() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Role-Based Access Control</h2>
        <p className="text-muted-foreground">
          Manage resources, permissions, and role-based access controls for the Proxa platform.
        </p>
      </div>

      <Tabs defaultValue="resources" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="roles">Role Permissions</TabsTrigger>
          <TabsTrigger value="users">User Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resources" className="mt-6">
          <ResourceManager />
        </TabsContent>
        
        <TabsContent value="roles" className="mt-6">
          <RolePermissions />
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <UserPermissions />
        </TabsContent>
      </Tabs>
    </div>
  );
}