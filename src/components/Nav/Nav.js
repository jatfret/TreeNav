import React from 'react'

function getItemHoverContent(percent){
  return (
    <div className="hoverContent">
      <h3>转账</h3>
      <p>
        <span className="label">渗透率：</span>
        <span className="value">{percent}</span>
      </p>
      <p>
        <span className="label">当前功能使用人数：</span>
        <span className="value">7.62人</span>
      </p>
      <p>
        <span className="label">产品总使用人数：</span>
        <span className="value">651469人</span>
      </p>
      <img src="/images/pic.png" />
    </div>
  )
}

export default class Nav extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isFetching: true,
      navData: null,
      level1Index: 0,
      orderTree: [0],
      orderSelected: null,
      collapseAll: true,
    }

    this.onHoverChangeColor = this.onHoverChangeColor.bind(this);
    this.onHoverTooltip = this.onHoverTooltip.bind(this);
  }
  componentDidMount(){
    this.loadData();
  }
  loadData(){
    fetch("/api/nav").then(response=>{return response.json()})
      .then(navData=>{console.log(navData);this.setState({isFetching: false, navData})})
      .catch(err=>{console.log(err)});
  }
  onHoverChangeColor(order){
    this.setState({
      orderSelected: order
    })
  }
  onHoverTooltip(cardRect, tooltipContent, isTooltipVisible){
    let wrapRect = this.navWrap.getBoundingClientRect();
    this.setState({
      cardRect,
      tooltipContent,
      isTooltipVisible,
      wrapRect
    });
    if(!tooltipContent){
      this.setState({orderSelected: null});
    }
  }
  render(){
    let { isFetching, navData, level1Index, collapseAll, orderTree, orderSelected, cardRect, tooltipContent, isTooltipVisible, wrapRect } = this.state;
    return (
      <div>
        {this.state.isFetching ?
          <h3>Loading...</h3>
          :
          <div className="nav">
            <ul className="nav-header">
              <li className="level first-level">一级功能（渗透率）</li>
              <li className="level">二级功能（渗透率）</li>
              <li className="level">三级功能（渗透率）</li>
              <li className="level">四级功能（渗透率）</li>
              <li className="level last-level">五级功能（渗透率）</li>
            </ul>
            <div className="nav-body" ref={navWrap=>this.navWrap = navWrap}>
              <div className="level-col level-col-first">
                {navData.level1.map((level1Item, i)=>{
                  return (
                    <div className={"item-card item-level1 " +
                      (orderSelected && orderSelected[0] === i ? "onpathHR1" : "") + (i > 0 ? " noborder-right" : "")}
                    key={level1Item.name}>{level1Item.name}</div>
                  )
                })}
              </div>
              <Level2Col
                level2={navData.level1[level1Index].level2}
                collapseAll={collapseAll}
                orderTree = {orderTree}
                orderSelected = {orderSelected}
                onHoverChangeColor={this.onHoverChangeColor}
                onHoverTooltip={this.onHoverTooltip}/>
              <Tooltip cardRect={cardRect} isTooltipVisible={isTooltipVisible} wrapRect={wrapRect} tooltipContent={tooltipContent}/>
            </div>
          </div>
        }
      </div>
    )
  }
}

class Level2Col extends React.Component {
  componentDidMount(){
    if(this.refs.level2Item){
      let height = this.refs.level2Item.getBoundingClientRect().height - 40 + 'px';
      this.refs.level2Item.style.height = height;
    }
  }
  render (){
    let { level2, collapseAll, onHoverChangeColor, orderTree, orderSelected, onHoverTooltip } = this.props;

    return (
      <ul className="level-col level-col-second">
        {level2.map((level2Item, i)=>{
          const orderLeve2 = orderTree.slice(0);
          orderLeve2.push(i);
          return (
            <li className={"level-second-item " + (orderSelected && orderSelected[1] > i ? "onpathV1" : "" ) }
              key={level2Item.name}
              ref={"level2Item" + i}
              >
              <div className={"item-card item-level2 " +
                (orderSelected && orderSelected[1] === i ? ("onpathHL1 " + (orderSelected.length > 2 ? "onpathHR2" : "")) : "") }
                onMouseEnter={()=>{onHoverChangeColor(orderLeve2)}}
                onMouseLeave={()=>{onHoverChangeColor(null)}}
              >
                <span className="card-name">{level2Item.name}（{level2Item.percent}）</span>
                <span className="card-icon card-icon-level2"
                  onMouseEnter={(e)=>{
                    e.stopPropagation();

                    let cardIconRect = e.target.getBoundingClientRect();
                    onHoverTooltip(cardIconRect, getItemHoverContent(level2Item.percent), true);
                  }}
                  onMouseLeave={(e)=>{
                    e.stopPropagation();

                    let cardRect = { left: 0, top: 0 };
                    //onHoverTooltip(cardRect, null, false);
                  }}
                ><span className="icon">i</span></span>
              </div>
                <Level3Col level3={level2Item.level3} collapseAll={collapseAll} orderTree={orderLeve2} orderSelected={orderSelected} onHoverChangeColor={onHoverChangeColor} onHoverTooltip={onHoverTooltip}/>
            </li>
          )
        })}
      </ul>
    )
  }
}

class Level3Col extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      collapse: props.collapseAll
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.collapseAll !== this.props.collapseAll){
      this.setState({collapse: nextProps.collapseAll});
    }
  }
  render(){
    let { level3, collapseAll, orderTree, orderSelected, onHoverChangeColor, onHoverTooltip } = this.props;
    let { collapse } = this.state;
    let level3InView = collapse ? level3.slice(0, 1) : level3;
    return (
      <ul className="level-col level-col-third">
        {level3InView.map((level3Item, index)=>{
          const orderLevel3 = orderTree.slice(0);
          orderLevel3.push(index);
          return (
            <li className={"level-third-item "  + (orderSelected && orderSelected.slice(0, 2).join("-") === orderLevel3.slice(0, 2).join("-") && orderSelected[2] > index ? "onpathV2" : "" )}
                key={level3Item.name}>
              <div className={ "item-card item-level3 " +
                (orderSelected && orderSelected.slice(0, 2).join("-") === orderLevel3.slice(0, 2).join("-") && orderSelected[2] === index ? ("onpathHL2 " + (orderSelected.length > 3 ? "onpathHR3" : "")) : "") }
                onMouseEnter={()=>{onHoverChangeColor(orderLevel3)}}
                onMouseLeave={()=>{/*onHoverChangeColor(null)*/}}
              >
                <span className="card-name">{level3Item.name}（{level3Item.percent}）</span>
                <span className="card-icon card-icon-level3"
                  onMouseEnter={(e)=>{
                    e.stopPropagation();

                    let cardIconRect = e.target.getBoundingClientRect();
                    onHoverTooltip(cardIconRect, getItemHoverContent(level3Item.percent), true);
                  }}
                  onMouseLeave={(e)=>{
                    e.stopPropagation();

                    let cardRect = { left: 0, top: 0 };
                    onHoverTooltip(cardRect, null, false);
                  }}
                ><span className="icon">i</span></span>
              </div>
              {index === level3InView.length - 1 ?
                <button className="toggle-btn"
                  onClick={(e)=>{this.setState({collapse: !collapse})}}>
                  <span className="toggle-icon toggle-level3">
                    <span className={ "triangle " + (collapse ? "triangle-down" : "triangle-up")}></span>
                  </span>
                  {collapse ? `展开${level3.length - 1}项` : "收起"}
                </button>
                :
                null
              }
              <Level4Col level4={level3Item.level4} collapseAll={collapseAll} orderTree={orderLevel3} orderSelected={orderSelected} onHoverChangeColor={onHoverChangeColor} onHoverTooltip={onHoverTooltip}/>
            </li>
          )
        })}
      </ul>
    )
  }
}

class Level4Col extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      collapse: props.collapseAll
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.collapseAll !== this.props.collapseAll){
      this.setState({collapse: nextProps.collapseAll});
    }
  }
  render(){
    let { level4 ,collapseAll, orderTree, orderSelected, onHoverChangeColor, onHoverTooltip } = this.props;
    let { collapse } = this.state;
    let level4InView = collapse ? level4.slice(0, 1) : level4;
    return (
      <ul className={`level-col level-col-forth ${collapse ? "level-position-absolute" : ""}`}>
        {level4InView.map((level4Item, index)=>{
          const orderLevel4 = orderTree.slice(0);
          orderLevel4.push(index);
          return (
            <li className={ "level-forth-item " + (orderSelected && orderSelected.slice(0, 3).join("-") === orderLevel4.slice(0, 3).join("-") && orderSelected[3] > index ? "onpathV3" : "" )}
                key={level4Item.name}>
              <div className={ "item-card item-level4 " +
                (orderSelected && orderSelected.slice(0, 3).join("-") === orderLevel4.slice(0, 3).join("-") && orderSelected[3] === index ? ("onpathHL3 " + (orderSelected.length > 4 ? "onpathHR4" : "")) : "") }
                onMouseEnter={()=>{onHoverChangeColor(orderLevel4)}}
                onMouseLeave={()=>{onHoverChangeColor(null)}}
              >
                <span className="card-name">{level4Item.name}（{level4Item.percent}）</span>
                <span className="card-icon card-icon-level4"
                  onMouseEnter={(e)=>{
                    e.stopPropagation();

                    let cardIconRect = e.target.getBoundingClientRect();
                    onHoverTooltip(cardIconRect, getItemHoverContent(level4Item.percent), true);
                  }}
                  onMouseLeave={(e)=>{
                    e.stopPropagation();

                    let cardRect = { left: 0, top: 0 };
                    onHoverTooltip(cardRect, null, false);
                  }}
                ><span className="icon">i</span></span>
              </div>
              {index === level4InView.length - 1 ?
                <button className="toggle-btn"
                  onClick={(e)=>{this.setState({collapse: !collapse})}}>
                    <span className="toggle-icon toggle-level4">
                      <span className={ "triangle " + (collapse ? "triangle-down" : "triangle-up")}></span>
                    </span>
                    {collapse ? `展开${level4.length - 1}项` : "收起"}
                  </button>
                :
                null
              }
              <Level5Col level5={level4Item.level5} collapseAll={collapseAll} orderTree={orderLevel4} orderSelected={orderSelected}  onHoverChangeColor={onHoverChangeColor} onHoverTooltip={onHoverTooltip} />
            </li>
          )
        })}
      </ul>
    )
  }
}

class Level5Col extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      collapse: props.collapseAll
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.collapseAll !== this.props.collapseAll){
      this.setState({collapse: nextProps.collapseAll});
    }
  }
  render(){
    let { level5, collapseAll, orderTree, orderSelected, onHoverChangeColor, onHoverTooltip } = this.props;
    let {collapse} = this.state;
    let level5InView = collapse ? level5.slice(0, 1) : level5;
    return (
      <ul className="level-col level-col-fifth">
        {level5InView.map((level5Item,index)=>{
          const orderLevel5 = orderTree.slice(0);
          orderLevel5.push(index);
          return (
            <li
              className={ "level-fifth-item"  + (orderSelected && orderSelected.slice(0, 4).join("-") === orderLevel5.slice(0, 4).join("-") && orderSelected[4] > index ? " onpathV4" : "" )}
              key={level5Item.name}>
              <div className={ "item-card item-level5 noborder-right" +
                (orderSelected && orderSelected.slice(0, 4).join("-") === orderLevel5.slice(0, 4).join("-") && orderSelected[4] === index ? " onpathHL4" : "") }
                onMouseEnter={()=>{onHoverChangeColor(orderLevel5)}}
                onMouseLeave={()=>{onHoverChangeColor(null)}}
              >
                <span className="card-name">{level5Item.name}（{level5Item.percent}）</span>
                <span
                  className="card-icon card-icon-level5"
                  onMouseEnter={(e)=>{
                    e.stopPropagation();

                    let cardIconRect = e.target.getBoundingClientRect();
                    onHoverTooltip(cardIconRect, getItemHoverContent(level5Item.percent), true);
                  }}
                  onMouseLeave={(e)=>{
                    e.stopPropagation();

                    let cardRect = { left: 0, top: 0 };
                    onHoverTooltip(cardRect, null, false);
                  }}
                ><span className="icon">i</span>
                </span>
              </div>
              {index === level5InView.length - 1 ?
                <button className="toggle-btn"
                  onClick={(e)=>{this.setState({collapse: !collapse})}}>
                  <span className="toggle-icon toggle-level5">
                    <span className={ "triangle " + (collapse ? "triangle-down" : "triangle-up")}></span>
                  </span>
                  {collapse ? `展开${level5.length - 1}项` : "收起"}
                </button>
                :
                null
              }
            </li>
          )
        })}
      </ul>
    )
  }
}

/**
 * @description tooltip组件
 * @prop {string} value
 * @prop {array} list
 * @prop {function} onChange
 */
class Tooltip extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      position: {left: 0, top: 0, display: 'none'},
      triangleClassName: 'triangle-left triangle-top'
    }
    this.getPosition = this.getPosition.bind(this);
    this.adjustPosition = this.adjustPosition.bind(this);
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      position: this.getPosition(nextProps),
      triangleClassName: 'triangle-left triangle-top'
    });
  }
  componentDidUpdate(){
    this.adjustPosition();
  }
  getPosition(nextProps){
    let { cardRect, wrapRect, isTooltipVisible} = nextProps;
    let top, left, triangleClassName;
    let position ={
      left: 0,
      top: 0
    };
    if(cardRect && wrapRect && isTooltipVisible){
      left = cardRect.left + cardRect.width + window.pageXOffset;
      top= cardRect.top - wrapRect.top - 24;
      position = {
        top,
        left,
        display: "block",
      };
    }

    return position ;
  }
  adjustPosition(){
      let { cardRect, wrapRect, isTooltipVisible } = this.props;
      let tooltip = document.getElementsByClassName("tooltip")[0];
      let rect = tooltip.getBoundingClientRect();
      if(isTooltipVisible){
        tooltip.classList.remove("triangle-right");
        tooltip.classList.add("triangle-left");
        tooltip.classList.remove("triangle-bottom");
        tooltip.classList.add("triangle-top");
        if( wrapRect.right - cardRect.right < rect.width ){
          tooltip.style.left = cardRect.left - wrapRect.left - rect.width - 10 + 'px';
          tooltip.classList.remove("triangle-left");
          tooltip.classList.add("triangle-right");
        }
        if( wrapRect.bottom - cardRect.bottom < rect.height ){
          tooltip.style.top = cardRect.bottom - wrapRect.top - rect.height + 24 + 'px';
          tooltip.classList.remove("triangle-top");
          tooltip.classList.add("triangle-bottom");
        }
      }
  }
  render() {
    let { cardRect, wrapRect, isTooltipVisible, tooltipContent } = this.props;
    let { position, triangleClassName } = this.state;

    return (
      <div className={`tooltip ${triangleClassName}`} ref={tooltip=>this.tooltip = tooltip} style={position}>
        {tooltipContent || null }
      </div>
    )
  }
}
