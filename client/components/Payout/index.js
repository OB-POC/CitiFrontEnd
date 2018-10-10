import React from 'react';
import './style.css';
import Header from '../headernew'
import Sidebar from '../sidebar'
import Services from '../../services'
import ReactLoading from 'react-loading'


export default class Rel extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      payOutData: {creditDebitMatch: []},
      username: '',
      lines : [],
      load: true
    }
  }
  componentWillMount() {
      var token = sessionStorage.getItem("token");
      Services.payOutCall(token, function(data){
          this.setState({payOutData : data});
          this.componentDidMount()
     }.bind(this),function(err){
     })
  }
  componentDidMount(){
    var username =
    this.setState({
      username: sessionStorage.getItem("username"),
      load: false
    })

    setTimeout(this.loader.bind(this),2000)
  }
  loader(){
    this.setState({
      load: true
    },function(){
      var payOutData = this.state.payOutData
      var lines = this.state.lines
      payOutData.creditDebitMatch.map(function(data,i){

        let lineVar = new LeaderLine(document.getElementById('element-'+i),document.getElementById('element-target-'+i),{path:'straight',color:'#4a4a4a'})

        lines.push(lineVar)
      })
      this.setState({lines:lines})
    })
  }
  componentWillUnmount(){
    var lines = this.state.lines
    lines.map(function(data,i){
        data.remove()
    })
  }

  handlePayment() {
    this.props.history.push('/offerings');
  }

    render(){
      var senders = []
      let senders1 = []

      let payFrom1  = this.state.payOutData.creditDebitMatch.map(function (data, i) {
        if(data.clearedTotalDue==false){
          var totalContributedAmount = data.senders.reduce(function(accumulator,currentValue){
            return accumulator+parseInt(currentValue.contributingAmount);
          }, 0)

          var outStandingBal = parseInt(data.totalBalanceDue) - totalContributedAmount

        }

        senders1 = data.senders.map(function(data,i){

          return(
              <div style={{display:'flex',height:'77px',paddingTop:'15px',paddingRight:'14px'}}>
                <div className='img_credit_payout'><img src={'../../../../images/cards/debit/'+data.bankName+'.png'} /></div>
                <div className='detail_credit'>
                    <div className=''>{data.bankName}<br/>
                      <div>
                        <b className=''> % APR</b><br/>
                      </div>
                    </div>
                </div>
                <div className='amount_credit'><h5><b style={{color:'#ff5d64'}}><span>&#163;</span> {data.contributingAmount}</b></h5></div>
              </div>
          )
        })
        return(
          <div className='row'>
            <div className='col-xs-4 outer_layer_payout' id={"element-"+i} style={{marginTop:'17px',marginLeft:'49px',borderRadius:'6px',backgroundColor:'#FFFFFF',boxShadow:' 0 5px 16px 0 rgba(0, 0, 0, 0.08)',width:'310px'}}>
              {senders1}
            </div>
            <div className='col-xs-4' >
              <div className='outer_layer_payout' style={{marginTop:'17px',marginLeft:'49px',borderRadius:'6px',backgroundColor:'#FFFFFF',boxShadow:' 0 5px 16px 0 rgba(0, 0, 0, 0.08)',width:'310px'}}>
                <div id={"element-target-"+i} style={{display:'flex',height:'77px',paddingTop:'15px',paddingRight:'14px'}}>
                  <div className='img_credit_payout'><img src={'../../../../images/cards/Credit/'+data.bankName+'.png'} /></div>
                  <div className='detail_credit'>
                      <div className=''>{data.bankName}<br/>
                        <div>
                          <b className=''>{data.interestRate} % APR</b><br/>
                        </div>
                      </div>
                  </div>
                  <div className='amount_credit'><h5><b style={{color:'#ff5d64'}}><span>&#163;</span> {data.totalBalanceDue}</b></h5></div>
                </div>
              </div>
            </div>
            <div className='col-xs-4' >
              <div className='outer_layer_payout' style={{marginTop:'8%',marginLeft:'49px',borderRadius:'6px',backgroundColor:'#FFFFFF',boxShadow:' 0 5px 16px 0 rgba(0, 0, 0, 0.08)',height:'77px',width:'160px'}}>
                <div style={{display:'flex',paddingTop:'15px',paddingRight:'14px'}}>
                <div className='amount_credit'><h5><b style={{color:'#ff5d64',marginLeft:'34px'}}><span>&#163;</span> {data.clearedTotalDue?0:outStandingBal }</b></h5></div>
                </div>
              </div>
            </div>
            </div>
        )
      })
        return(
          this.state.load ?
            <div  className='container-fluid' style={{paddingLeft:'0px',paddingRight:'0px'}}>
              <Header username = {this.state.username}/>
              <div style = {{display:"flex"}}>
                <Sidebar/>
                <div  style = {{backgroundColor:"#f5f6fa",width:"100%",paddingBottom:'30px'}}>
                  <div className='Recommended_for_you'>
                  Recommended for you
                  </div>
                  <div className="headerImg">
                    <div style={{backgroundImage:'url("images/img-recommendations.png")',backgroundRepeat:'no-repeat',height:'170px',width:'1160px'}}>
                      <div style={{paddingTop:'29px',paddingLeft:'195px'}}>
                        <div className='heading_text'>
                          Hey Alice
                        </div>
                        <div style={{width:'609px'}} className='heading_text'>
                          We have listed the best pay-off options for you. Your available balance in Barclays £4600 & AER at present is 0.25%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='main_section' style={{marginTop:'17px',marginLeft:'70px'}}>
                      <div className='row' style={{marginTop:'33px',marginLeft:'48px',marginRight:'105px'}}>
                        <div className='col-4' style={{margin:'auto'}}>
                          <p className='main_section_heading_text'>Pay from</p>
                        </div>
                        <div className='col-4' style={{margin:'auto'}}>
                          <p className='main_section_heading_text'>Current outstanding amount</p>
                        </div>
                        <div className='col-4' style={{margin:'auto'}}>
                          <p className='main_section_heading_text'>Outstanding balance</p>
                        </div>
                      </div>
                    <div className='Line' style={{marginLeft:'48px',marginRight:'105px'}}/>
                      {payFrom1}
                      <br/>
                      <center>
                      <button className='btn payout-button optimize-btt' onClick={this.handlePayment.bind(this)}>
                      <div>AGREE & PAY</div>
                      <div>
                        <i style = {{width: '26px',height: '18.3px'}} className='fas fa-arrow-right'></i>
                      </div>
                    </button></center>
                    <br/>
                  </div>

                </div>
              </div>
            </div>:
            <div>
            <center><ReactLoading type='bubbles' color='black' height={'20%'} width={'20%'} /></center>
            </div>
        );
    }
}
