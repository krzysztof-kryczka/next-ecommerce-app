import { TabsEnum } from '@/enum/TabsEnum'

export type UserSidebarProps = {
   activeTab: TabsEnum
   setActiveTab: (tab: TabsEnum) => void
}
