import { FlexBox } from '@filament/react/layout';
import { Text } from '@filament/react/text';
import { FolderEmpty } from '@filament/react/pictograms/folder-empty';
import { quickEntryStyles as s } from './quick-entry-card.css';

interface QuickEntryEmptyStateProps {
  kind: 'repair' | 'device';
}

export const QuickEntryEmptyState = ({ kind }: QuickEntryEmptyStateProps) => (
  <FlexBox
    className={s.emptyState}
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    gap={8}
    role="status"
  >
    <FolderEmpty size="small" aria-hidden="true" />
    <Text variant="body-s">
      {kind === 'repair' ? '暂无可查询的报修' : '暂无可选择的设备'}
    </Text>
  </FlexBox>
);
