import { Component, createSignal, JSX } from "solid-js";
import { TbChevronDown, TbChevronRight } from "solid-icons/tb";
import './style.less';

type Props = {
  name: string
  visible?: boolean
  children?: JSX.Element
  icon?: JSX.Element
  badge?: string | number
  description?: string
}

const SettingsContainer: Component<Props> = (props) => {
  const [visible, setVisible] = createSignal<boolean>(props.visible == true);

  const toggle = () => {
    setVisible(prev => !prev);
  };

  return <div class={`SettingsContainer ${visible() ? "open" : "collapsed"}`}>
    <div class={"settings-header"} onClick={toggle} role="button" tabIndex={0}>
      <div class={"header-title"}>
        {props.icon ? <span class={"header-icon"}>{props.icon}</span> : null}
        <h3>{props.name}</h3>
        {props.badge !== undefined ? <span class={"header-badge"}>{props.badge}</span> : null}
      </div>
      <span class={"header-chevron"}>
        {visible() ? <TbChevronDown size={18} /> : <TbChevronRight size={18} />}
      </span>
    </div>
    {props.description && visible() ? <p class={"settings-description"}>{props.description}</p> : null}
    <div class={`children ${visible() ? "" : "hidden"}`}>
      {props.children}
    </div>
  </div>;
};

export default SettingsContainer;
