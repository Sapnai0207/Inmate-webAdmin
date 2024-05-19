import React, { ReactNode } from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  HomeOutlined,
  MedicineBoxOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import Link from "next/link";

const { Sider } = Layout;

export default function SideBar({
  children,
  selectedId,
}: {
  children: ReactNode;
  selectedId: string;
}) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider className="min-h-screen">
        <Menu
          theme="dark"
          mode="vertical"
          className="min-h-screen justify-center flex flex-col"
          selectedKeys={[selectedId]}
          items={[
            {
              key: "home",
              icon: <HomeOutlined />,
              label: <Link href="/inmate">Нүүр</Link>,
            },
            {
              key: "users",
              icon: <UserOutlined />,
              label: <Link href="/inmate/users">Хэрэглэгчид</Link>,
            },
            {
              key: "treatments",
              icon: <MedicineBoxOutlined />,
              label: <Link href="/inmate/treatments">Эмчилгээ</Link>,
            },
            {
              key: "logOut",
              icon: <LogoutOutlined />,
              label: <Link href='/'>Гарах</Link>
            }
          ]}
        />
      </Sider>
      <Layout>{children}</Layout>
    </Layout>
  );
}
