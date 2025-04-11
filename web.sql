-- 用户表
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'user',  -- user, coach, admin
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- 运动员信息表
CREATE TABLE athletes (
    athlete_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    name VARCHAR(50) NOT NULL,
    gender VARCHAR(10),
    birth_date DATE,
    height FLOAT,
    weight FLOAT,
    playing_style VARCHAR(50),  -- 打法风格
    grip_type VARCHAR(30),      -- 握拍方式
    dominant_hand VARCHAR(10),  -- 使用手
    experience_years INTEGER,   -- 训练年限
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 视频资源表
CREATE TABLE videos (
    video_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    file_url VARCHAR(255) NOT NULL,
    thumbnail_url VARCHAR(255),
    duration INTEGER,  -- 视频时长(秒)
    file_size INTEGER, -- 文件大小(字节)
    video_type VARCHAR(30), -- 训练视频、比赛视频等
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 轨迹分析表
CREATE TABLE trajectory_analyses (
    analysis_id SERIAL PRIMARY KEY,
    video_id INTEGER REFERENCES videos(video_id),
    user_id INTEGER REFERENCES users(user_id),
    title VARCHAR(100),
    status VARCHAR(20) DEFAULT 'processing', -- processing, completed, failed
    processing_time INTEGER,  -- 处理耗时(秒)
    result_json JSON,  -- 存储分析结果的JSON数据
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 球轨迹数据表
CREATE TABLE ball_trajectories (
    trajectory_id SERIAL PRIMARY KEY,
    analysis_id INTEGER REFERENCES trajectory_analyses(analysis_id),
    frame_number INTEGER,  -- 帧号
    time_point FLOAT,      -- 时间点(秒)
    position_x FLOAT,      -- 球在画面中的X坐标
    position_y FLOAT,      -- 球在画面中的Y坐标
    position_z FLOAT,      -- 球的深度估计值
    speed FLOAT,           -- 球速(km/h)
    spin_type VARCHAR(20), -- 旋转类型(上旋、下旋、侧旋等)
    spin_rate FLOAT,       -- 旋转速率
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 运动员动作数据表
CREATE TABLE athlete_movements (
    movement_id SERIAL PRIMARY KEY,
    analysis_id INTEGER REFERENCES trajectory_analyses(analysis_id),
    athlete_position VARCHAR(10), -- 球台左侧/右侧
    frame_start INTEGER,     -- 起始帧
    frame_end INTEGER,       -- 结束帧
    time_start FLOAT,        -- 起始时间(秒)
    time_end FLOAT,          -- 结束时间(秒)
    movement_type VARCHAR(50), -- 动作类型(正手攻球、反手拉球等)
    posture_score FLOAT,     -- 姿势评分(0-100)
    power_score FLOAT,       -- 发力评分(0-100)
    stability_score FLOAT,   -- 稳定性评分(0-100)
    overall_score FLOAT,     -- 综合评分(0-100)
    keypoints_json JSON,     -- 骨骼关键点数据
    comments TEXT,           -- 动作评价
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 训练记录表
CREATE TABLE training_sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    title VARCHAR(100) NOT NULL,
    session_date DATE,
    duration INTEGER,  -- 训练时长(分钟)
    location VARCHAR(100),
    training_type VARCHAR(50), -- 技术训练、体能训练等
    notes TEXT,
    overall_score FLOAT,  -- 综合评分(0-100)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 训练指标表
CREATE TABLE training_metrics (
    metric_id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES training_sessions(session_id),
    metric_name VARCHAR(50),  -- 例如:准确性、速度、稳定性等
    metric_value FLOAT,
    metric_unit VARCHAR(20),  -- 单位
    target_value FLOAT,       -- 目标值
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 训练报告表
CREATE TABLE training_reports (
    report_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    title VARCHAR(100) NOT NULL,
    report_date DATE,
    time_period_start DATE,  -- 报告涵盖时间段-开始
    time_period_end DATE,    -- 报告涵盖时间段-结束
    template_id INTEGER,     -- 使用的报告模板ID
    content_json JSON,       -- 报告内容JSON
    status VARCHAR(20) DEFAULT 'draft', -- draft, published
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 报告模板表
CREATE TABLE report_templates (
    template_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    content_structure JSON,  -- 模板结构
    is_default BOOLEAN DEFAULT FALSE,
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI分析建议表
CREATE TABLE ai_suggestions (
    suggestion_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    analysis_id INTEGER REFERENCES trajectory_analyses(analysis_id),
    session_id INTEGER REFERENCES training_sessions(session_id),
    suggestion_type VARCHAR(50),  -- 技术建议、训练计划建议等
    content TEXT,
    priority VARCHAR(10) DEFAULT 'medium',  -- high, medium, low
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 系统设置表
CREATE TABLE settings (
    setting_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    setting_key VARCHAR(50) NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户登录历史表
CREATE TABLE login_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    device_info TEXT,
    login_status VARCHAR(20)  -- success, failed
);

-- 插入样本数据
-- 插入用户数据
INSERT INTO users (username, password, email, phone, role, avatar_url, created_at, updated_at, last_login) VALUES
('admin', '$2a$10$XrjOt2FAiO2SjcQxFPDUxO8tJg8Y5ZFLm6rUaWyKXM07KjLbhqHdi', 'admin@pingpong.com', '13800138000', 'admin', '/assets/avatars/admin.png', NOW(), NOW(), NOW()),
('coach_zhang', '$2a$10$QTksBBf9aoOc0zy8zN3JI.WVzvzppP76P4W5qoW8aZ5.xUVVX7Wz2', 'coach_zhang@pingpong.com', '13800138001', 'coach', '/assets/avatars/coach1.png', NOW(), NOW(), NOW()),
('coach_li', '$2a$10$Ev/wFGHLOi32fvGtTLGz7e8MyYyKwA0tNdEhD5I7PXxXG9nYGLEyq', 'coach_li@pingpong.com', '13800138002', 'coach', '/assets/avatars/coach2.png', NOW(), NOW(), NOW()),
('wang_lei', '$2a$10$xC26JpN/G6dUKvVxmJ8WtOuL2g8UoNCH8kbgGs8H.VGxHrSutUV5K', 'wang_lei@example.com', '13800138003', 'user', '/assets/avatars/user1.png', NOW(), NOW(), NOW()),
('zhang_min', '$2a$10$ntUTZXLMgauhSJzNeYAzV.jOJQLJh0XY59iSt7RYUh9fFZHdwweHi', 'zhang_min@example.com', '13800138004', 'user', '/assets/avatars/user2.png', NOW(), NOW(), NOW()),
('liu_yang', '$2a$10$M3PtK.Vt/p4TjkscaBtNw.6XTU0qFcR5q9/Rywxsj0zhRE5wZS2ce', 'liu_yang@example.com', '13800138005', 'user', '/assets/avatars/user3.png', NOW(), NOW(), NOW()),
('chen_wei', '$2a$10$ZlcOPeLSk0V6j3CKnUzcw.WlXdXVY1V7WvZ8b9bvW0oVs6FuKfkOW', 'chen_wei@example.com', '13800138006', 'user', '/assets/avatars/user4.png', NOW(), NOW(), NOW());

-- 插入运动员信息
INSERT INTO athletes (user_id, name, gender, birth_date, height, weight, playing_style, grip_type, dominant_hand, experience_years) VALUES
(4, '王磊', '男', '1998-05-15', 178, 70, '快攻型', '横拍', '右手', 8),
(5, '张敏', '女', '2000-08-22', 165, 55, '削球型', '直拍', '右手', 6),
(6, '刘洋', '男', '1995-11-07', 182, 75, '全面型', '横拍', '右手', 10),
(7, '陈伟', '男', '1997-03-29', 175, 68, '弧圈型', '横拍', '左手', 7);

-- 插入视频资源
INSERT INTO videos (user_id, title, description, file_url, thumbnail_url, duration, file_size, video_type, status) VALUES
(4, '正手攻球训练', '王磊正手攻球训练视频', '/storage/videos/video1.mp4', '/storage/thumbnails/thumb1.jpg', 180, 25600000, '训练视频', 'completed'),
(5, '削球技术展示', '张敏削球技术训练', '/storage/videos/video2.mp4', '/storage/thumbnails/thumb2.jpg', 240, 32000000, '训练视频', 'completed'),
(6, '比赛实战录像', '刘洋市级比赛视频', '/storage/videos/video3.mp4', '/storage/thumbnails/thumb3.jpg', 600, 75000000, '比赛视频', 'completed'),
(4, '步法移动训练', '王磊步法移动训练', '/storage/videos/video4.mp4', '/storage/thumbnails/thumb4.jpg', 210, 28000000, '训练视频', 'completed'),
(7, '发球技术训练', '陈伟发球技术训练', '/storage/videos/video5.mp4', '/storage/thumbnails/thumb5.jpg', 195, 26000000, '训练视频', 'processing');

-- 插入轨迹分析
INSERT INTO trajectory_analyses (video_id, user_id, title, status, processing_time, result_json) VALUES
(1, 4, '正手攻球分析', 'completed', 45, '{"summary": "整体攻球质量良好，击球点稍低，建议提高击球点位置"}'),
(2, 5, '削球技术分析', 'completed', 53, '{"summary": "削球稳定性优秀，回球质量高，建议增加削球变化"}'),
(3, 6, '比赛表现分析', 'completed', 120, '{"summary": "比赛中技术运用全面，但关键球处理需加强"}'),
(4, 4, '步法移动分析', 'completed', 48, '{"summary": "步法移动灵活，但重心偏高，建议降低重心提高稳定性"}'),
(5, 7, '发球技术分析', 'processing', NULL, NULL);

-- 插入球轨迹数据（简化样本，实际数据会更多）
INSERT INTO ball_trajectories (analysis_id, frame_number, time_point, position_x, position_y, position_z, speed, spin_type, spin_rate) VALUES
(1, 10, 0.33, 320, 240, 50, 35.2, '上旋', 1200),
(1, 11, 0.37, 350, 230, 45, 36.5, '上旋', 1220),
(1, 12, 0.40, 380, 225, 40, 37.8, '上旋', 1250),
(2, 15, 0.50, 400, 260, 30, 25.5, '下旋', 900),
(2, 16, 0.53, 425, 265, 28, 24.8, '下旋', 950),
(2, 17, 0.57, 450, 270, 26, 24.2, '下旋', 980),
(3, 25, 0.83, 300, 250, 60, 42.0, '侧旋', 1500),
(3, 26, 0.87, 330, 240, 55, 43.5, '侧旋', 1520),
(3, 27, 0.90, 360, 235, 50, 45.0, '侧旋', 1540);

-- 插入运动员动作数据
INSERT INTO athlete_movements (analysis_id, athlete_position, frame_start, frame_end, time_start, time_end, movement_type, posture_score, power_score, stability_score, overall_score, comments) VALUES
(1, '右侧', 5, 15, 0.17, 0.50, '正手攻球', 85, 88, 78, 84, '击球动作规范，发力充分，但稳定性略显不足'),
(2, '左侧', 10, 20, 0.33, 0.67, '反手削球', 90, 75, 92, 86, '削球姿势标准，稳定性高，但力量稍欠缺'),
(3, '右侧', 20, 30, 0.67, 1.00, '正手拉球', 82, 90, 80, 84, '拉球发力强劲，但动作可再规范'),
(3, '右侧', 50, 60, 1.67, 2.00, '侧身攻球', 78, 92, 75, 82, '侧身移动及时，发力充分，但稳定性需提高'),
(4, '左侧', 15, 25, 0.50, 0.83, '步法移动', 88, 80, 85, 84, '步法移动灵活，重心控制良好');

-- 插入训练记录
INSERT INTO training_sessions (user_id, title, session_date, duration, location, training_type, notes, overall_score) VALUES
(4, '基础技术训练', '2023-06-10', 120, '市体育馆', '技术训练', '专注于基本功训练', 85),
(5, '削球专项训练', '2023-06-08', 90, '学校训练室', '技术训练', '重点加强削球变化', 78),
(6, '比赛战术演练', '2023-06-05', 150, '市体育馆', '战术训练', '模拟比赛环境，演练战术配合', 90),
(7, '发球专项训练', '2023-06-02', 100, '学校训练室', '技术训练', '多球训练发球技术', 82),
(4, '体能训练', '2023-06-12', 60, '市体育馆', '体能训练', '提升耐力和爆发力', 88);

-- 插入训练指标
INSERT INTO training_metrics (session_id, metric_name, metric_value, metric_unit, target_value, notes) VALUES
(1, '球速', 35.5, 'km/h', 40, '球速略低于目标值'),
(1, '准确率', 85, '%', 90, '准确率接近目标值'),
(1, '稳定性', 82, '%', 85, '稳定性良好'),
(2, '旋转强度', 75, '%', 80, '下旋强度达标'),
(2, '落点精度', 88, '%', 85, '落点控制超出目标值'),
(3, '战术执行', 90, '%', 85, '战术执行优秀'),
(3, '关键球处理', 80, '%', 90, '关键球处理需提高'),
(4, '发球成功率', 92, '%', 90, '发球成功率高'),
(4, '发球变化', 78, '%', 85, '发球变化不够丰富');

-- 插入报告模板
INSERT INTO report_templates (name, description, content_structure, is_default, created_by) VALUES
('标准训练报告', '提供基础训练数据分析和建议', '{"sections": ["基本信息", "训练概述", "详细分析", "技术评估", "进步空间", "建议"]}', TRUE, 1),
('比赛分析报告', '针对比赛表现的详细分析', '{"sections": ["比赛信息", "技术统计", "战术分析", "对手分析", "改进方向"]}', FALSE, 2),
('专项技术报告', '针对特定技术的深入分析', '{"sections": ["技术介绍", "现状分析", "详细数据", "对比分析", "提升方案"]}', FALSE, 2);

-- 插入训练报告
INSERT INTO training_reports (user_id, title, report_date, time_period_start, time_period_end, template_id, content_json, status) VALUES
(4, '王磊六月训练总结', '2023-06-15', '2023-06-01', '2023-06-15', 1, '{"基本信息": {"姓名": "王磊", "训练周期": "2023年6月1日-15日"}, "训练概述": "本月共完成8次技术训练，2次体能训练，1次比赛", "详细分析": "正手攻球技术有明显提升，球速提高3km/h", "技术评估": "整体技术水平提升，尤其是正手攻球和步法移动", "进步空间": "反手拉球仍需加强", "建议": "建议增加反手拉球专项训练"}', 'published'),
(5, '张敏削球技术分析', '2023-06-12', '2023-06-01', '2023-06-10', 3, '{"技术介绍": "削球是防守型打法的核心技术", "现状分析": "张敏的削球稳定性高，但变化不足", "详细数据": {"稳定性": 92, "变化": 75, "落点": 88}, "对比分析": "与上月相比，稳定性提高5%，变化提高3%", "提升方案": "建议增加不同旋转的削球训练，丰富变化"}', 'published'),
(6, '刘洋市级比赛分析', '2023-06-08', '2023-06-05', '2023-06-05', 2, '{"比赛信息": {"比赛名称": "市级联赛", "时间": "2023年6月5日", "对手": "李强"}, "技术统计": {"得分": 58, "失误": 25, "得分率": 70}, "战术分析": "中远台结合战术执行良好，关键球处理欠佳", "对手分析": "对手正手强，反手弱，可多攻反手", "改进方向": "加强关键球心理训练，提高抗压能力"}', 'published');

-- 插入AI分析建议
INSERT INTO ai_suggestions (user_id, analysis_id, session_id, suggestion_type, content, priority) VALUES
(4, 1, 1, '技术建议', '建议提高击球点，增加前冲力量，使攻球更加有力。同时注意保持身体平衡，提高稳定性。', 'high'),
(5, 2, 2, '技术建议', '削球稳定性已经很好，建议增加不同类型的下旋和侧旋变化，提高削球的威胁性。', 'medium'),
(6, 3, 3, '战术建议', '比赛中关键分处理需加强，建议在训练中增加模拟比赛关键分的练习，提高心理素质和抗压能力。', 'high'),
(7, NULL, 4, '训练计划', '建议每周安排2-3次发球专项训练，重点提高发球的旋转变化和落点控制。', 'medium'),
(4, 4, 5, '体能建议', '建议增加下肢力量训练，提高步法移动的爆发力和稳定性。', 'medium');

-- 插入系统设置
INSERT INTO settings (user_id, setting_key, setting_value) VALUES
(1, 'system_theme', 'light'),
(1, 'notification_enabled', 'true'),
(2, 'system_theme', 'dark'),
(2, 'notification_enabled', 'true'),
(4, 'system_theme', 'light'),
(4, 'chart_color_scheme', 'blue'),
(5, 'system_theme', 'light'),
(5, 'chart_color_scheme', 'green');

-- 插入登录历史
INSERT INTO login_history (user_id, login_time, ip_address, device_info, login_status) VALUES
(1, NOW() - INTERVAL 2 DAY, '192.168.1.100', 'Chrome 90.0, Windows 10', 'success'),
(2, NOW() - INTERVAL 1 DAY, '192.168.1.101', 'Firefox 88.0, MacOS', 'success'),
(3, NOW() - INTERVAL 1 DAY, '192.168.1.102', 'Safari 14.1, iOS 14.5', 'success'),
(4, NOW() - INTERVAL 12 HOUR, '192.168.1.103', 'Chrome 90.0, Android 11', 'success'),
(5, NOW() - INTERVAL 8 HOUR, '192.168.1.104', 'Edge 90.0, Windows 10', 'success'),
(6, NOW() - INTERVAL 4 HOUR, '192.168.1.105', 'Chrome 90.0, Windows 10', 'success'),
(7, NOW() - INTERVAL 2 HOUR, '192.168.1.106', 'Safari 14.1, MacOS', 'success'),
(4, NOW() - INTERVAL 1 HOUR, '192.168.1.103', 'Chrome 90.0, Android 11', 'success');
