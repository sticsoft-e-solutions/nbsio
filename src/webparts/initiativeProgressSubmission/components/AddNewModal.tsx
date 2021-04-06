import * as React from 'react';
import { useId, useBoolean } from '@uifabric/react-hooks';
import styles from './styles.module.scss';
import {
  getTheme,
  mergeStyleSets,
  FontWeights,
  ContextualMenu,
  Toggle,
  Modal,
  IDragOptions,
  IconButton,
  IIconProps,
  PrimaryButton,DefaultButton,
  TextField,
  DialogFooter,
} from 'office-ui-fabric-react';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

const optionStatus: IChoiceGroupOption[] = [
  { key: 'A', text: 'On Schedule' },
  { key: 'B', text: 'Minor Issues' },
  { key: 'C', text: 'Need Help' },
];
const optionTrend: IChoiceGroupOption[] = [
  { key: 'A', text: 'Trending Up' },
  { key: 'B', text: 'Trending down' },
  { key: 'C', text: 'Stable' },
];

const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 300 },
};

const options: IDropdownOption[] = [
  { key: 'Embrace Operational Excellence', text: 'Embrace Operational Excellence' },
  { key: 'China Market Focus', text: 'China Market Focus' },
  { key: 'lettuce', text: 'Lettuce' },
];


const dragOptions: IDragOptions = {
  moveMenuItemText: 'Move',
  closeMenuItemText: 'Close',
  menu: ContextualMenu,
};
const cancelIcon: IIconProps = { iconName: 'Cancel' };

export const ModalBasicExample: React.FunctionComponent = () => {
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);

  // Use useId() to ensure that the IDs are unique on the page.
  // (It's also okay to use plain strings and manually ensure uniqueness.)
  const titleId = useId('title');

  return (
    <div>
      <PrimaryButton onClick={showModal} text="Open Modal" />
      <Modal
        titleAriaId={titleId}
        isOpen={isModalOpen}
        onDismiss={hideModal}
        isBlocking={false}
        containerClassName={contentStyles.container}
      >
        <div className={contentStyles.header}>
          <span id={titleId}>Add New</span>
          <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close popup modal"
            onClick={hideModal}
          />
        </div>
        <div className={contentStyles.body}>
          <div className="row">
            <div className="col-6">
              <Dropdown
                placeholder="Select an option"
                label="Programs"
                options={options}
                styles={dropdownStyles}
              />
            </div>
            <div className="col-6">

              <Dropdown
                placeholder="Select an option"
                label="Initiative"
                options={options}
                styles={dropdownStyles}
              />
            </div>
          </div>
          <TextField label="Key Achievements in Period" multiline rows={3} />
          <TextField label="Key Activities for next Period" multiline rows={3} />
          <TextField label="Support / Attention Needed" multiline rows={3} />
          <TextField label="Summary" multiline rows={3} />
          <div className="row">
            <div className="col-6">
              <div className="card card-body my-2"><ChoiceGroup defaultSelectedKey="A" options={optionStatus} onChange={_onChange} label="Scope Status" required={true} /></div>
              <div className="card card-body my-2"><ChoiceGroup defaultSelectedKey="A" options={optionStatus} onChange={_onChange} label="Schedule Status" required={true} /></div>
              <div className="card card-body my-2"><ChoiceGroup defaultSelectedKey="A" options={optionStatus} onChange={_onChange} label="Change & Comms Status" required={true} /></div>
              <div className="card card-body my-2"><ChoiceGroup defaultSelectedKey="A" options={optionStatus} onChange={_onChange} label="Overall Status" required={true} /></div>
            </div>
            <div className="col-6">
              <div className="card card-body my-2"><ChoiceGroup defaultSelectedKey="A" options={optionTrend} onChange={_onChange} label="Scope Trend" required={true} /></div>
              <div className="card card-body my-2"><ChoiceGroup defaultSelectedKey="A" options={optionTrend} onChange={_onChange} label="Schedule Trend" required={true} /></div>
              <div className="card card-body my-2"><ChoiceGroup defaultSelectedKey="A" options={optionTrend} onChange={_onChange} label="Change & Comms Trend" required={true} /></div>
              <div className="card card-body my-2"><ChoiceGroup defaultSelectedKey="A" options={optionTrend} onChange={_onChange} label="Overall Trend" required={true} /></div>
            </div>
          </div>
          <DialogFooter>
            <PrimaryButton onClick={hideModal} text="Send" />
            <DefaultButton onClick={hideModal} text="Don't send" />
          </DialogFooter>
        </div>
      </Modal>
    </div>
  );
};
function _onChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void {
  console.dir(option);
}
const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
  },
  header: [
    // tslint:disable-next-line:deprecation
    theme.fonts.xLargePlus,
    {
      flex: '1 1 auto',
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: 'flex',
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: '12px 12px 14px 24px',
    },
  ],
  body: {
    flex: '4 4 auto',
    padding: '0 24px 24px 24px',
    overflowY: 'hidden',
    selectors: {
      p: { margin: '14px 0' },
      'p:first-child': { marginTop: 0 },
      'p:last-child': { marginBottom: 0 },
    },
  },
});
const toggleStyles = { root: { marginBottom: '20px' } };
const iconButtonStyles = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: 'auto',
    marginTop: '4px',
    marginRight: '2px',
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};