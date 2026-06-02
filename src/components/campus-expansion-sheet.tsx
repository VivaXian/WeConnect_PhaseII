import { useState } from 'react';
import { Button } from '@filament/react/button';
import { Text } from '@filament/react/text';
import { sheetStyles } from './upgrade-form-sheet.css';

interface CampusExpansionSheetProps {
  availableHospitals: string[];
  currentCampuses: string[];
  onClose: () => void;
  onSubmit: (hospitals: string[], salesName: string, salesPhone: string) => void;
}

export const CampusExpansionSheet = ({
  availableHospitals,
  currentCampuses,
  onClose,
  onSubmit,
}: CampusExpansionSheetProps) => {
  const [selectedHospitals, setSelectedHospitals] = useState<string[]>(currentCampuses);
  const [salesName, setSalesName] = useState('');
  const [salesPhone, setSalesPhone] = useState('');

  const toggleHospital = (h: string) => {
    if (currentCampuses.includes(h)) return;
    setSelectedHospitals((prev) =>
      prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]
    );
  };

  const newSelectedHospitals = selectedHospitals.filter((h) => !currentCampuses.includes(h));

  const handleSubmit = () => {
    if (newSelectedHospitals.length === 0) return;
    onSubmit(newSelectedHospitals, salesName, salesPhone);
  };

  return (
    <div className={sheetStyles.overlay} onClick={onClose} role="presentation">
      <div
        className={sheetStyles.panel}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="申请调整权限范围"
      >
        <div className={sheetStyles.handle} />
        <div className={sheetStyles.header}>
          <Text variant="heading-s">申请调整权限范围</Text>
          <button type="button" className={sheetStyles.closeBtn} onClick={onClose} aria-label="关闭">
            ✕
          </button>
        </div>
        <div className={sheetStyles.divider} />

        <div className={sheetStyles.fieldGroup}>
          <span className={sheetStyles.fieldLabel}>
            申请院区
            <span className={sheetStyles.required}>*</span>
          </span>
          <span className={sheetStyles.fieldHint}>仅限有报修或设备绑定记录的院区，可多选</span>
          <div className={sheetStyles.checkList}>
            {availableHospitals.map((h) => {
              const isLocked = currentCampuses.includes(h);
              const isSelected = selectedHospitals.includes(h);
              return (
                <button
                  key={h}
                  type="button"
                  className={
                    isLocked
                      ? sheetStyles.checkItemLocked
                      : isSelected
                      ? sheetStyles.checkItemSelected
                      : sheetStyles.checkItem
                  }
                  onClick={() => toggleHospital(h)}
                  disabled={isLocked}
                >
                  <span
                    className={
                      isLocked
                        ? sheetStyles.checkboxLocked
                        : isSelected
                        ? sheetStyles.checkboxChecked
                        : sheetStyles.checkbox
                    }
                  >
                    {(isLocked || isSelected) ? '✓' : ''}
                  </span>
                  <span>{h}</span>
                  {isLocked && <span className={sheetStyles.lockedTag}>已授权</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className={sheetStyles.fieldGroup}>
          <span className={sheetStyles.fieldLabel}>
            对接销售
            <span className={sheetStyles.optionalTag}>选填</span>
          </span>
          <span className={sheetStyles.fieldHint}>如有飞利浦销售联系人可填写，有助于加快审核</span>
          <input
            type="text"
            className={sheetStyles.textInput}
            placeholder="销售姓名"
            value={salesName}
            onChange={(e) => setSalesName(e.target.value)}
          />
          <input
            type="tel"
            className={sheetStyles.textInput}
            placeholder="销售手机号"
            value={salesPhone}
            onChange={(e) => setSalesPhone(e.target.value)}
          />
        </div>

        <div className={sheetStyles.footerNote}>
          <p className={sheetStyles.footerNoteText}>
            提交后由飞利浦售后服务团队审核，预计需 1-7 个工作日，结果将通过消息中心通知您。
          </p>
        </div>

        <div className={sheetStyles.submitArea}>
          <Button
            variant="primary"
            onPress={handleSubmit}
            isDisabled={newSelectedHospitals.length === 0}
          >
            提交申请
          </Button>
        </div>
      </div>
    </div>
  );
};
