'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/types';

const COMPONENT_CATEGORIES = [
  { id: 'cpu', label: '1. CPU - BỘ VI XỬ LÝ', required: true },
  { id: 'mainboard', label: '2. MAIN - BỘ MẠCH CHỦ', required: true },
  { id: 'ram', label: '3. RAM - BỘ NHỚ TRONG', required: true },
  { id: 'ssd1', label: '4. Ổ CỨNG SSD 1', required: true },
  { id: 'ssd2', label: '5. Ổ CỨNG SSD 2', required: false },
  { id: 'hdd', label: '6. Ổ CỨNG HDD', required: false },
  { id: 'gpu', label: '7. VGA - CARD MÀN HÌNH', required: false },
  { id: 'psu', label: '8. PSU - NGUỒN MÁY TÍNH', required: true },
  { id: 'case', label: '9. CASE - VỎ MÁY', required: true },
  { id: 'cooling', label: '10. FAN - COOLING - TẢN NHIỆT', required: true },
  { id: 'monitor', label: '11. MONITOR - MÀN HÌNH', required: false },
  { id: 'wifi_modem', label: '12. WIFI/MODEM - MODEM WIFI', required: false },
  { id: 'keyboard', label: '13. KEYBOARD - BÀN PHÍM', required: false },
  { id: 'chair', label: '14. CHAIR - GHẾ', required: false },
  { id: 'table', label: '15. TABLE - BÀN', required: false },
  { id: 'monitor_arm', label: '16. MONITOR ARM - GIÁ ĐỠ MÀN HÌNH', required: false },
];

interface CompatibilityWarning {
  type: 'error' | 'warning';
  message: string;
}

export default function BuilderPage() {
  const [selectedParts, setSelectedParts] = useState<{ [key: string]: Product | null }>({
    cpu: null,
    mainboard: null,
    gpu: null,
    ram: null,
    psu: null,
    ssd1: null,
    ssd2: null,
    hdd: null,
    case: null,
    cooling: null,
    monitor: null,
    wifi_modem: null,
    keyboard: null,
    chair: null,
    table: null,
    monitor_arm: null,
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [warnings, setWarnings] = useState<CompatibilityWarning[]>([]);

  // Load selected parts from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('selectedParts');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSelectedParts(parsed);
      }
    } catch (err) {
      console.error('Error loading selected parts:', err);
    }
  }, []);

  // Calculate total price
  useEffect(() => {
    const total = Object.values(selectedParts).reduce((sum, part) => {
      return sum + (part?.price || 0);
    }, 0);
    setTotalPrice(total);
  }, [selectedParts]);

  // Check compatibility
  useEffect(() => {
    const newWarnings: CompatibilityWarning[] = [];

    // Calculate total power consumption
    let totalPowerConsumption = 0;
    const powerSources: string[] = [];

    if (selectedParts.cpu?.specs?.power_consumption) {
      totalPowerConsumption += selectedParts.cpu.specs.power_consumption;
      powerSources.push(`CPU: ${selectedParts.cpu.specs.power_consumption}W`);
    }

    if (selectedParts.gpu?.specs?.power_consumption) {
      totalPowerConsumption += selectedParts.gpu.specs.power_consumption;
      powerSources.push(`GPU: ${selectedParts.gpu.specs.power_consumption}W`);
    }

    if (selectedParts.mainboard?.specs?.power_consumption) {
      totalPowerConsumption += selectedParts.mainboard.specs.power_consumption;
      powerSources.push(`Mainboard: ${selectedParts.mainboard.specs.power_consumption}W`);
    }

    if (selectedParts.ram?.specs?.power_consumption) {
      totalPowerConsumption += selectedParts.ram.specs.power_consumption;
      powerSources.push(`RAM: ${selectedParts.ram.specs.power_consumption}W`);
    }

    // Check PSU compatibility
    if (selectedParts.psu && totalPowerConsumption > 0) {
      const psuMaxPower = selectedParts.psu.specs?.max_power;

      if (psuMaxPower) {
        // Add a 20% safety margin (recommended for stable system)
        const safetyMargin = totalPowerConsumption * 0.2;
        const recommendedMinPower = totalPowerConsumption + safetyMargin;

        if (psuMaxPower < totalPowerConsumption) {
          newWarnings.push({
            type: 'error',
            message: `❌ PSU không đủ công suất! Tiêu thụ: ${totalPowerConsumption}W, PSU: ${psuMaxPower}W`,
          });
        } else if (psuMaxPower < recommendedMinPower) {
          newWarnings.push({
            type: 'warning',
            message: `⚠️ PSU gần hết công suất! Tiêu thụ: ${totalPowerConsumption}W, PSU: ${psuMaxPower}W (Khuyến nghị tối thiểu: ${Math.round(recommendedMinPower)}W)`,
          });
        }
      }
    }

    // Warning if PSU selected but no power-consuming components
    if (selectedParts.psu && totalPowerConsumption === 0) {
      newWarnings.push({
        type: 'warning',
        message: '⚠️ Chưa có thông tin tiêu thụ điện. Vui lòng thêm CPU, GPU, hoặc các linh kiện khác',
      });
    }

    // Check for missing required components
    const missingComponents: string[] = [];
    
    
    COMPONENT_CATEGORIES.forEach((cat) => {
      if (cat.required && !selectedParts[cat.id]) {
        // Extract the component name from the label
        const componentName = cat.label.split(' - ')[1] || cat.label;
        missingComponents.push(componentName);
      }
    });

    if (missingComponents.length > 0) {
      newWarnings.push({
        type: 'warning',
        message: `⚠️ Linh kiện bắt buộc còn thiếu: ${missingComponents.join(', ')}`,
      });
    }

    // Check CPU and Motherboard socket compatibility
    if (selectedParts.cpu && selectedParts.mainboard) {
      const cpuSocket = selectedParts.cpu.specs?.socket;
      const mbSocket = selectedParts.mainboard.specs?.socket;

      if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
        newWarnings.push({
          type: 'error',
          message: `❌ CPU và Motherboard không tương thích! CPU socket: ${cpuSocket}, Motherboard socket: ${mbSocket}`,
        });
      }
    }

    // Check RAM compatibility with Motherboard
    if (selectedParts.ram && selectedParts.mainboard) {
      const ramType = selectedParts.ram.specs?.type;
      const mbRamType = selectedParts.mainboard.specs?.ram_type;

      if (ramType && mbRamType && ramType !== mbRamType) {
        newWarnings.push({
          type: 'error',
          message: `❌ RAM không tương thích với Motherboard! RAM type: ${ramType}, Motherboard RAM type: ${mbRamType}`,
        });
      }
    }

    // Warning if CPU selected but no Motherboard
    if (selectedParts.cpu && !selectedParts.mainboard) {
      newWarnings.push({
        type: 'warning',
        message: '⚠️ Bạn đã chọn CPU nhưng chưa chọn Motherboard. Vui lòng chọn Motherboard phù hợp',
      });
    }

    // Warning if Motherboard selected but no CPU
    if (selectedParts.mainboard && !selectedParts.cpu) {
      newWarnings.push({
        type: 'warning',
        message: '⚠️ Bạn đã chọn Motherboard nhưng chưa chọn CPU. Vui lòng chọn CPU phù hợp',
      });
    }

    // Warning if RAM selected but no Motherboard
    if (selectedParts.ram && !selectedParts.mainboard) {
      newWarnings.push({
        type: 'warning',
        message: '⚠️ Bạn đã chọn RAM nhưng chưa chọn Motherboard. Vui lòng chọn Motherboard',
      });
    }

    setWarnings(newWarnings);
  }, [selectedParts]);

  const handleRemoveComponent = useCallback((componentId: string) => {
    setSelectedParts(prev => ({
      ...prev,
      [componentId]: null,
    }));
  }, []);

  const handleClearBuilder = useCallback(() => {
    if (confirm('Bạn có chắc muốn xóa toàn bộ danh sách?')) {
      setSelectedParts({
        cpu: null,
        mainboard: null,
        gpu: null,
        ram: null,
        psu: null,
        ssd1: null,
        ssd2: null,
        hdd: null,
        case: null,
        cooling: null,
        monitor: null,
        wifi_modem: null,
        keyboard: null,
        chair: null,
        table: null,
        monitor_arm: null,
      });
      localStorage.removeItem('selectedParts');
    }
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const hasErrors = warnings.some(w => w.type === 'error');
  const hasWarnings = warnings.some(w => w.type === 'warning');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Bộ Builder PC</h1>
            <p className="text-gray-600 mt-2">Xây dựng cấu hình máy tính của bạn</p>
          </div>
          <Link href="/">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition">
              ← Quay lại chọn linh kiện
            </button>
          </Link>
        </div>

        {/* Warnings Section */}
        {warnings.length > 0 && (
          <div className="mb-8 space-y-3">
            {warnings.map((warning, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-l-4 ${
                  warning.type === 'error'
                    ? 'bg-red-50 border-red-500 text-red-800'
                    : 'bg-yellow-50 border-yellow-500 text-yellow-800'
                }`}
              >
                <p className="font-medium">{warning.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* Success Message */}
        {selectedParts.cpu && selectedParts.mainboard && selectedParts.ram && !hasErrors && (
          <div className="mb-8 p-4 rounded-lg bg-green-50 border-l-4 border-green-500">
            <p className="text-green-800 font-medium">✅ Cấu hình tương thích! Bạn có thể tiếp tục xây dựng</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-8">
          {/* Component List */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {COMPONENT_CATEGORIES.map((category) => {
                const component = selectedParts[category.id];
                return (
                  <div
                    key={category.id}
                    className="border-b last:border-b-0 p-6 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{category.label}</h3>
                        {component ? (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-lg font-medium text-gray-900">
                              {component.brand} {component.name}
                            </p>
                            <p className="text-2xl font-bold text-blue-600 mt-2">
                              {formatPrice(component.price)}
                            </p>
                            {component.specs && Object.keys(component.specs).length > 0 && (
                              <div className="mt-3 text-sm text-gray-600">
                                {Object.entries(component.specs).map(([key, value]) => (
                                  <p key={key}>
                                    <span className="font-medium capitalize">{key}:</span> {value}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">Chưa chọn linh kiện</p>
                        )}
                      </div>
                      {component && (
                        <button
                          onClick={() => handleRemoveComponent(category.id)}
                          className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition text-sm font-medium"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price Summary */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Tổng Cộng</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số linh kiện:</span>
                  <span className="font-medium text-gray-900">
                    {Object.values(selectedParts).filter(p => p !== null).length}/{COMPONENT_CATEGORIES.length}
                  </span>
                </div>

                {/* Missing Required Components */}
                {COMPONENT_CATEGORIES.filter(cat => cat.required && !selectedParts[cat.id]).length > 0 && (
                  <>
                    <div className="h-px bg-gray-200"></div>
                    <div className="text-sm">
                      <p className="text-gray-600 font-medium mb-2">Còn thiếu:</p>
                      <ul className="text-red-600 text-xs space-y-1">
                        {COMPONENT_CATEGORIES.filter(cat => cat.required && !selectedParts[cat.id]).map(cat => (
                          <li key={cat.id}>• {cat.label.split(' - ')[1] || cat.label}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                <div className="h-px bg-gray-200"></div>

                {/* Power Consumption */}
                {(selectedParts.cpu?.specs?.power_consumption || 
                  selectedParts.gpu?.specs?.power_consumption ||
                  selectedParts.mainboard?.specs?.power_consumption ||
                  selectedParts.ram?.specs?.power_consumption) && (
                  <>
                    <div className="text-sm">
                      <p className="text-gray-600 font-medium mb-2">⚡ Tiêu thụ điện:</p>
                      
                      {selectedParts.cpu?.specs?.power_consumption && (
                        <p className="text-xs text-gray-600">CPU: {selectedParts.cpu.specs.power_consumption}W</p>
                      )}
                      {selectedParts.gpu?.specs?.power_consumption && (
                        <p className="text-xs text-gray-600">GPU: {selectedParts.gpu.specs.power_consumption}W</p>
                      )}
                      {selectedParts.mainboard?.specs?.power_consumption && (
                        <p className="text-xs text-gray-600">Mainboard: {selectedParts.mainboard.specs.power_consumption}W</p>
                      )}
                      {selectedParts.ram?.specs?.power_consumption && (
                        <p className="text-xs text-gray-600">RAM: {selectedParts.ram.specs.power_consumption}W</p>
                      )}

                      {selectedParts.psu?.specs?.max_power && (
                        <p className="text-xs font-bold text-blue-600 mt-2">
                          PSU: {selectedParts.psu.specs.max_power}W
                        </p>
                      )}
                    </div>
                    <div className="h-px bg-gray-200"></div>
                  </>
                )}

                {/* Compatibility Status */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`font-bold ${hasErrors ? 'text-red-600' : 'text-green-600'}`}>
                    {hasErrors ? '⚠️ Lỗi' : hasWarnings ? '⚠️ Cảnh báo' : '✅ OK'}
                  </span>
                </div>
                <div className="h-px bg-gray-200"></div>

                <div className="flex justify-between text-2xl font-bold">
                  <span className="text-gray-900">Tổng giá:</span>
                  <span className="text-blue-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <button 
                disabled={hasErrors}
                className={`w-full py-3 rounded-lg font-bold transition mb-3 ${
                  hasErrors
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                💳 Thanh toán
              </button>

              <button
                onClick={handleClearBuilder}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-lg font-medium transition"
              >
                🗑️ Xóa toàn bộ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
