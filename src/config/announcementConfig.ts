import type { AnnouncementConfig } from "../types/announcementConfig";

export const announcementConfig: AnnouncementConfig = {
	// 公告标题
	title: "欢迎来到 NovaTrail",

	// 公告内容
	content: "记录技术、思考与沿途风景。",

	// 是否允许用户关闭公告
	closable: true,

	link: {
		// 启用链接
		enable: true,
		// 链接文本
		text: "了解本站",
		// 链接 URL
		url: "/about/",
		// 内部链接
		external: false,
	},
};
