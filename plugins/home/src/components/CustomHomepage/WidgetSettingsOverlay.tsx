/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  createStyles,
  Dialog,
  DialogContent,
  Grid,
  makeStyles,
  Theme,
  Tooltip,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import { Widget } from './types';
import Form from '@rjsf/material-ui';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconGrid: {
      height: '100%',
      '& *': {
        padding: 0,
      },
    },
    settingsOverlay: {
      position: 'absolute',
      backgroundColor: 'rgba(40, 40, 40, 0.93)',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      padding: theme.spacing(2),
      color: 'white',
    },
  }),
);
interface WidgetSettingsOverlayProps {
  id: string;
  widget: Widget;
  handleRemove: (id: string) => void;
  handleSettingsSave: (id: string, settings: Record<string, any>) => void;
  settings?: Record<string, any>;
}

export const WidgetSettingsOverlay = (props: WidgetSettingsOverlayProps) => {
  const { id, widget, settings, handleRemove, handleSettingsSave } = props;
  const [settingsDialogOpen, setSettingsDialogOpen] = React.useState(false);
  const styles = useStyles();

  return (
    <div className={styles.settingsOverlay}>
      {widget.settingsSchema && (
        <Dialog
          open={settingsDialogOpen}
          className="widgetSettingsDialog"
          onClose={() => setSettingsDialogOpen(false)}
        >
          <DialogContent>
            <Form
              showErrorList={false}
              schema={widget.settingsSchema}
              noHtml5Validate
              formData={settings}
              formContext={{ settings }}
              onSubmit={({ formData, errors }) => {
                if (errors.length === 0) {
                  handleSettingsSave(id, formData);
                  setSettingsDialogOpen(false);
                }
              }}
            />
          </DialogContent>
        </Dialog>
      )}
      <Grid
        container
        className={styles.iconGrid}
        alignItems="center"
        justifyContent="center"
      >
        {widget.settingsSchema && (
          <Grid item className="overlayGridItem">
            <Tooltip title="Edit settings">
              <IconButton
                color="primary"
                onClick={() => setSettingsDialogOpen(true)}
              >
                <SettingsIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </Grid>
        )}
        <Grid item className="overlayGridItem">
          <Tooltip title="Delete widget">
            <IconButton color="secondary" onClick={() => handleRemove(id)}>
              <DeleteIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </div>
  );
};
