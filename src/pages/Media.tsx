import { Image, Upload, Trash2, Video } from 'lucide-react';
import Button from '../components/Button';

export default function Media() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1e3a5f]">مكتبة الوسائط</h2>
          <p className="text-sm text-gray-600 mt-1">إدارة الصور والفيديوهات</p>
        </div>
        <Button icon={Upload} variant="primary">
          رفع ملفات جديدة
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              {index % 3 === 0 ? (
                <Video className="w-12 h-12 text-gray-400" />
              ) : (
                <Image className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-gray-900 truncate">
                file_{index + 1}.{index % 3 === 0 ? 'mp4' : 'jpg'}
              </p>
              <p className="text-xs text-gray-600">{Math.floor(Math.random() * 500) + 100} KB</p>
              <button className="mt-2 w-full p-2 hover:bg-red-50 rounded-lg flex items-center justify-center gap-2 text-red-600 text-sm">
                <Trash2 className="w-4 h-4" />
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
