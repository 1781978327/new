// 数据存储相关函数
const storage = {
    // 保存数据到 localStorage
    saveModelData: (data) => {
        try {
            localStorage.setItem('modelData', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            console.error('保存数据失败:', error);
            return { success: false, error: error.message };
        }
    },

    // 从 localStorage 加载数据
    loadModelData: () => {
        try {
            const data = localStorage.getItem('modelData');
            if (data) {
                return { success: true, data: JSON.parse(data) };
            }
            return { success: false, error: '没有找到保存的数据' };
        } catch (error) {
            console.error('加载数据失败:', error);
            return { success: false, error: error.message };
        }
    }
};

// 导出存储对象
export default storage; 