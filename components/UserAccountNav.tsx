"use client";

import { FaUser } from "react-icons/fa";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger

} from "@/components/ui/dropdown-menu";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";
import { Laptop, Lock, LogOut, Server, Settings } from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";


export const UserAccountNav = () => {
  const { t } = useTranslation(['common', 'main-nav']);
  const user = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" size="icon" className="bg-slate-400 hover:bg-slate-200 p-1 cursor-pointer">
          <Avatar>
            <AvatarImage src={user?.image || ""} />
            <AvatarFallback>
              <FaUser />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-5" align="end">
        <Link href="/user-settings" className="flex">
          <DropdownMenuItem className="hover:cursor-pointer">
              <Settings className="mr-2" /> {t('main-nav:settings')}
          </DropdownMenuItem>
        </Link>
        <Link href="/user-settings/client" className="flex">
          <DropdownMenuItem className="hover:cursor-pointer">
              <Laptop className="mr-2" /> {t('client_session')}
          </DropdownMenuItem>
        </Link>
        <Link href="/user-settings/server" className="flex">
          <DropdownMenuItem className="hover:cursor-pointer">
              <Server className="mr-2" /> {t('server_session')}
          </DropdownMenuItem>
        </Link>
        <Link href="/user-settings/admin" className="flex">
          <DropdownMenuItem className="hover:cursor-pointer">
              <Lock className="mr-2" /> {t('admin_session')}
          </DropdownMenuItem>
        </Link>
        <LogoutButton>
          <DropdownMenuItem className="cursor-pointer">
            <LogOut className="mr-2" /> {t('log_out')}
          </DropdownMenuItem>
          </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
};


