import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X } from "lucide-react";

interface Boss {
  id: number;
  name: string;
  image: string;
  isActive: boolean;
}

const BOSS_NAMES = [
  "콜디스트", "웜", "닥터", "매지션", "사신",
  "보호막로봇", "고기슬라임", "냥술사", "그런트", "나이트샤먼",
  "방파이어", "나하투", "블링카"
];

export default function Home() {
  const [bosses, setBosses] = useState<Boss[]>([]);
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const [editingImage, setEditingImage] = useState<string | null>(null);

  // 초기화: localStorage에서 데이터 로드 또는 기본값 설정
  useEffect(() => {
    const savedBosses = localStorage.getItem("bosses");
    if (savedBosses) {
      setBosses(JSON.parse(savedBosses));
    } else {
      const initialBosses = BOSS_NAMES.map((name, index) => ({
        id: index + 1,
        name,
        image: `/boss_${index + 1}.png`,
        isActive: false,
      }));
      setBosses(initialBosses);
    }
  }, []);

  // 보스 상태 변경 시 localStorage 저장
  useEffect(() => {
    if (bosses.length > 0) {
      localStorage.setItem("bosses", JSON.stringify(bosses));
    }
  }, [bosses]);

  const toggleBossStatus = (id: number) => {
    const updated = bosses.map(boss =>
      boss.id === id ? { ...boss, isActive: !boss.isActive } : boss
    );
    setBosses(updated);
    if (selectedBoss?.id === id) {
      setSelectedBoss(updated.find(b => b.id === id) || null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedBoss) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        const updated = bosses.map(boss =>
          boss.id === selectedBoss.id
            ? { ...boss, image: imageData }
            : boss
        );
        setBosses(updated);
        setSelectedBoss(updated.find(b => b.id === selectedBoss.id) || null);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetBossImage = (id: number) => {
    const bossIndex = bosses.findIndex(b => b.id === id);
    if (bossIndex !== -1) {
      const updated = [...bosses];
      updated[bossIndex].image = `/boss_${id}.png`;
      setBosses(updated);
      if (selectedBoss?.id === id) {
        setSelectedBoss(updated[bossIndex]);
      }
    }
  };

  const activeBossCount = bosses.filter(b => b.isActive).length;
  const inactiveBossCount = bosses.length - activeBossCount;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-800 border-b border-amber-700 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-amber-50 mb-2">보스 트래커</h1>
          <p className="text-amber-100">게임 보스의 출현 여부를 추적하고 관리하세요</p>
        </div>
      </div>

      {/* 통계 영역 */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-b border-slate-700 py-4 px-4">
        <div className="max-w-7xl mx-auto flex gap-8">
          <div className="flex-1">
            <div className="text-amber-400 text-sm font-medium mb-1">출현한 보스</div>
            <div className="text-3xl font-bold text-amber-50">{activeBossCount}</div>
          </div>
          <div className="flex-1">
            <div className="text-slate-400 text-sm font-medium mb-1">미출현 보스</div>
            <div className="text-3xl font-bold text-slate-300">{inactiveBossCount}</div>
          </div>
          <div className="flex-1">
            <div className="text-slate-400 text-sm font-medium mb-1">진행률</div>
            <div className="text-3xl font-bold text-slate-300">
              {bosses.length > 0 ? Math.round((activeBossCount / bosses.length) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 보스 목록 (좌측) */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 rounded-lg border border-slate-700 p-6">
              <h2 className="text-xl font-bold text-amber-50 mb-4">보스 목록</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {bosses.map(boss => (
                  <button
                    key={boss.id}
                    onClick={() => setSelectedBoss(boss)}
                    className={`relative group transition-all duration-300 ${
                      selectedBoss?.id === boss.id ? "ring-2 ring-amber-400" : ""
                    }`}
                  >
                    {/* 보스 아이콘 */}
                    <div
                      className={`w-full aspect-square rounded-full border-4 overflow-hidden transition-all duration-300 flex items-center justify-center ${
                        boss.isActive
                          ? "border-amber-400 shadow-lg shadow-amber-400/50 bg-gradient-to-br from-amber-600 to-amber-800"
                          : "border-slate-600 shadow-lg shadow-slate-900 bg-slate-800"
                      }`}
                    >
                      {boss.image && (
                        <img
                          src={boss.image}
                          alt={boss.name}
                          className={`w-full h-full object-cover transition-all duration-300 ${
                            boss.isActive ? "opacity-100" : "opacity-30 grayscale"
                          }`}
                        />
                      )}
                    </div>

                    {/* 상태 표시 */}
                    <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
                      <div className="text-center">
                        <div className="text-xs font-bold text-white mb-1">
                          {boss.isActive ? "출현" : "미출현"}
                        </div>
                        <div className="text-xs text-amber-300">클릭하여 변경</div>
                      </div>
                    </div>

                    {/* 보스 이름 */}
                    <div className="mt-2 text-sm font-medium text-slate-300 truncate">
                      {boss.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 상세 정보 패널 (우측) */}
          <div className="lg:col-span-1">
            {selectedBoss ? (
              <Card className="bg-slate-900 border-slate-700 p-6">
                <h3 className="text-lg font-bold text-amber-50 mb-4">{selectedBoss.name}</h3>

                {/* 보스 이미지 미리보기 */}
                <div className="mb-6">
                  <div
                    className={`w-full aspect-square rounded-lg border-2 overflow-hidden flex items-center justify-center transition-all duration-300 ${
                      selectedBoss.isActive
                        ? "border-amber-400 bg-gradient-to-br from-amber-600/20 to-amber-800/20"
                        : "border-slate-600 bg-slate-800"
                    }`}
                  >
                    {selectedBoss.image && (
                      <img
                        src={selectedBoss.image}
                        alt={selectedBoss.name}
                        className={`w-full h-full object-cover transition-all duration-300 ${
                          selectedBoss.isActive ? "opacity-100" : "opacity-30 grayscale"
                        }`}
                      />
                    )}
                  </div>
                </div>

                {/* 상태 표시 */}
                <div className="mb-4 p-3 rounded-lg bg-slate-800 border border-slate-700">
                  <div className="text-xs text-slate-400 mb-1">현재 상태</div>
                  <div className={`text-lg font-bold ${
                    selectedBoss.isActive ? "text-amber-400" : "text-slate-400"
                  }`}>
                    {selectedBoss.isActive ? "✓ 출현" : "✗ 미출현"}
                  </div>
                </div>

                {/* 상태 변경 버튼 */}
                <Button
                  onClick={() => toggleBossStatus(selectedBoss.id)}
                  className={`w-full mb-3 transition-all duration-300 ${
                    selectedBoss.isActive
                      ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
                      : "bg-amber-600 hover:bg-amber-500 text-white"
                  }`}
                >
                  {selectedBoss.isActive ? "미출현으로 변경" : "출현으로 변경"}
                </Button>

                {/* 이미지 수정 섹션 */}
                <div className="border-t border-slate-700 pt-4">
                  <h4 className="text-sm font-bold text-amber-50 mb-3">이미지 관리</h4>

                  <label className="block w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="w-full px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-amber-400 cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium text-slate-300 hover:text-amber-300">
                      <Upload size={16} />
                      이미지 변경
                    </div>
                  </label>

                  <Button
                    onClick={() => resetBossImage(selectedBoss.id)}
                    variant="outline"
                    className="w-full mt-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-slate-200"
                  >
                    <X size={16} className="mr-2" />
                    기본 이미지로 복원
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="bg-slate-900 border-slate-700 p-6 flex items-center justify-center h-full min-h-96">
                <div className="text-center">
                  <div className="text-slate-400 text-sm">보스를 선택하여</div>
                  <div className="text-slate-400 text-sm">상세 정보를 확인하세요</div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
