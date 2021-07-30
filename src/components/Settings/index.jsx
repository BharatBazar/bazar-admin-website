import React from "react";
import { connect } from "react-redux";
import { Icon, Tooltip } from "antd";
import { SettingFilled, SettingOutlined } from "@ant-design/icons";
import { toggleSettingPanel } from "@/store/actions";
import "./index.less";
const Settings = (props) => {
  const { toggleSettingPanel } = props;
  return (
    <div className="settings-container">
      <Tooltip placement="bottom" title="Open settings">
        <SettingOutlined onClick={toggleSettingPanel} />
      </Tooltip>
    </div>
  );
};

export default connect(null, { toggleSettingPanel })(Settings);
