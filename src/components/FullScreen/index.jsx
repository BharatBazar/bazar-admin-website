import React, { useState, useEffect } from "react";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import screenfull from "screenfull";
import { Icon, message, Tooltip } from "antd";
import "./index.less";

const click = () => {
  if (!screenfull.isEnabled) {
    message.warning("you browser can not work");
    return false;
  }
  screenfull.toggle();
};

const FullScreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const change = () => {
    setIsFullscreen(screenfull.isFullscreen);
  };

  useEffect(() => {
    screenfull.isEnabled && screenfull.on("change", change);
    return () => {
      screenfull.isEnabled && screenfull.off("change", change);
    };
  }, []);

  const title = isFullscreen ? "Fullscreen exit" : "Fullscreen";
  const type = isFullscreen ? "fullscreen-exit" : "fullscreen";
  return (
    <div className="fullScreen-container">
      <Tooltip placement="bottom" title={title}>
        {type === "fullscreen-exit" ? (
          <FullscreenExitOutlined onClick={click} />
        ) : (
          <FullscreenOutlined onClick={click} />
        )}
      </Tooltip>
    </div>
  );
};

export default FullScreen;
