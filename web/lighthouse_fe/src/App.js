import React, { useState, useCallback } from "react";
import './App.css';
import pic from './111.png'

import { Input, Select, message, Progress, Table, Button } from 'antd';

const { Search } = Input;
const { Option } = Select;

let timer = null

const App = () =>  {
  const [loading, setLoading] = useState(false)
  const [times, setTimes] = useState(1);
  const [show, setShow] = useState(false);
  const [percent, setPercent] = useState(0);
  const [tableData, setTableData] = useState([]);
  const conicColors = { '0%': '#87d068', '50%': '#ffe58f', '100%': '#ffccc7' };

  const sendAjax = (url, runs) => {
    fetch(`//39.104.28.31/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        runs: runs
      }) // 将数据转换为JSON字符串
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (+data.code === 200) {
          const td = data.data.result.map((e, i) => {
            return {
              times: i + 1,
              performance: `${e.performance}分`,
              link: e.link
            }
          })
          setTableData(td)
          clearInterval(timer)
          setLoading(false)
          timer = null
          setPercent(100)
        }
      })
      .catch(error => console.error('Error:', error));
  }

  const fakeProgress = (v, times) => {
    setShow(true)
    const time = 100 / times
    let t = 0
    if (t >= times - 1) {
      clearInterval(timer)
      timer = null
      setPercent(90)
      return
    } else {
      t += 1
      setPercent(t * time)
    }
    timer = setInterval(() => {
      if (t > times - 1) {
        clearInterval(timer)
        timer = null
        setPercent(90)
      } else {
        t += 1
        setPercent(t * time)
      }

      sendAjax(v, times)
    }, 25000)
  }

  const onSearch = useCallback((v) => {
    if (v) {
      const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
      if (regex.test(v)) {
        setTableData([])
        setPercent(0)
        setShow(false)
        message.success('执行成功，正在进行测试，请不要关闭页面');
        setLoading(true)
        fakeProgress(v, times)
        sendAjax(v, times)
        return
      }
      message.error('请输入正确的url');
      return
    }
    message.error('请输入要测试的url');
  }, [times])

  const onChange = (v) => {
    switch (v) {
      case '执行 1 次':
        setTimes(1);
        break
      case '执行 5 次':
        setTimes(5);
        break
      case '执行 10 次':
        setTimes(10);
        break
      case '执行 20 次':
        setTimes(20);
        break
      default:
        setTimes(1)
    }
  }

  const selectBefore = (
    <Select defaultValue="执行 1 次" onChange={onChange}>
      <Option value="执行 1 次">执行 1 次</Option>
      <Option value="执行 5 次">执行 5 次</Option>
      <Option value="执行 10 次">执行 10 次</Option>
      <Option value="执行 20 次">执行 20 次</Option>
    </Select>
  );

  return (
    <div className="App">
      <div className="Search">
        <div className="Pic">
          <img src={pic} alt="pic" style={{width: '250px'}}/>
        </div>
        <Search
          placeholder="请输入Url"
          enterButton={loading ? "Testing" : "Test"}
          size="large"
          loading={loading}
          addonBefore={selectBefore}
          onSearch={onSearch}
        />
        {
          show && (
            <div className="Result">
              {
                tableData.length < 1 ? (
                  <>
                    <p>测试进度</p>
                    <Progress percent={percent} strokeColor={conicColors} />
                  </>
                  ) : (
                    <Table columns={
                      [
                        {
                          title: '序号',
                          dataIndex: 'times',
                          key: 'times'
                        },
                        {
                          title: '分数',
                          dataIndex: 'performance',
                          key: 'performance'
                        },
                        {
                          title: '源文件',
                          dataIndex: 'link',
                          key: 'link',
                          render: (v) => {
                            return (
                              <Button type="link" href={`//39.104.28.31/download/${v}`}>{v}</Button>
                            )
                          }
                        }
                      ]
                    } dataSource={tableData} />
                  )
              }
            </div>
          )
        }
      </div>
    </div>
  );
}

export default App;
