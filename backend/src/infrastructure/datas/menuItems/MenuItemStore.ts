import { MenuItem } from "../../../domain/entities/menuItems/MenuItem";

const items: MenuItem[] = [
  new MenuItem(1, '醤油ラーメン', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', '醤油ベースの定番ラーメン', 800, 'ラーメン'),
  new MenuItem(2, '味噌ラーメン', 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=400&h=300&fit=crop', '味噌ベースの濃厚ラーメン', 850, 'ラーメン'),
  new MenuItem(3, 'チャーハン', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop', '香ばしい炒飯', 700, 'ご飯もの'),
  new MenuItem(4, '唐揚げ', 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=400&h=300&fit=crop', 'ジューシーな鶏の唐揚げ', 600, 'サイドメニュー'),
  new MenuItem(5, '餃子', 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop', '手作りの焼き餃子', 500, 'サイドメニュー'),
  new MenuItem(6, 'ビール', 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop', 'キンキンに冷えたビール', 400, 'ドリンク'),
];

export default items;