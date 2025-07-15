# Rxjs for React

## Installing

Use repo https://registry.geckoai.cn/

```shell
pnpm install @geckoai/rx-react
```

## Example Usage

```typescript
import { Typed } from '@geckoai/class-transformer';
import { ApiProperty, ApiRequest } from '@geckoai/http';
import { Pageable } from '../../../../common/models/definitions/Pageable';

@ApiRequest({
  url: '/api/user-service/user/list/pageable',
  method: 'get',
  description: '分页查询用户信息',
})
export class GetUserListPageable extends Pageable {
  @ApiProperty({
    required: false,
    description: '用户别名',
    in: 'query',
    type: 'string',
  })
  @Typed(String)
  public alias?: string;
  @ApiProperty({
    required: false,
    description: '部门ID',
    in: 'query',
    type: 'string',
  })
  @Typed(String)
  public departmentId?: string;
  @ApiProperty({
    required: false,
    description: '部门名称',
    in: 'query',
    type: 'string',
  })
  @Typed(String)
  public departmentName?: string;
  @ApiProperty({
    required: false,
    description: '邮箱',
    in: 'query',
    type: 'string',
  })
  @Typed(String)
  public email?: string;
  @ApiProperty({
    required: false,
    description: '是否递归查找子部门',
    in: 'query',
    type: 'boolean',
  })
  @Typed(Boolean)
  public fetchChild?: boolean;
  @ApiProperty({
    required: false,
    description: '关键字',
    in: 'query',
    type: 'string',
  })
  @Typed(String)
  public keyword?: string;
  @ApiProperty({
    required: false,
    description: '用户姓名',
    in: 'query',
    type: 'string',
  })
  @Typed(String)
  public name?: string;
  @ApiProperty({
    required: false,
    description: '是否开通微信小程序: 0-否 1-是',
    in: 'query',
    type: 'string',
  })
  @Typed(String, {
    rules: {
      type: 'Enum',
      enums: ['0', '1'],
    },
  })
  public openWxApp?: '0' | '1';
  @ApiProperty({
    required: false,
    description: '电话号码',
    in: 'query',
    type: 'string',
  })
  @Typed(String)
  public phone?: string;
  @ApiProperty({
    required: false,
    description: '角色ID',
    in: 'query',
    type: 'string',
  })
  @Typed(String)
  public roleId?: string;
  @ApiProperty({
    required: false,
    description: '角色名称',
    in: 'query',
    type: 'string',
  })
  @Typed(String)
  public roleName?: string;
  @ApiProperty({
    required: false,
    description: '状态: 0-录入 1-启用 2-禁用',
    in: 'query',
    type: 'string',
  })
  @Typed(String, {
    rules: {
      type: 'Enum',
      enums: ['0', '1', '2'],
    },
  })
  public status?: '0' | '1' | '2';
  @ApiProperty({
    required: false,
    description: '租户ID',
    in: 'query',
    type: 'string',
  })
  @Typed(String)
  public tenantId?: string;
  @ApiProperty({
    required: false,
    description: '用户登陆名',
    in: 'query',
    type: 'string',
  })
  @Typed(String)
  public userName?: string;
}

```

```typescript
import { RxLoader } from '@geckoai/rx-react';
import { ApiProvide } from '../../../common/providers/api.provide';
import { GetUserListPageable } from './models/GetUserListPageable';

export const { loader, useRxLoaderData } = new RxLoader.Builder(
  GetUserListPageable,
)
  .setProvide(ApiProvide)
  .build();

```

```typescript jsx
import { switchMap, map, tap, finalize, combineLatest } from 'rxjs';
import { useRxLoaderData } from './loader';
import { useRxViewModel } from '@geckoai/rx-react';
import { useService } from '@geckoai/platform-react';
import { HttpClient } from '@geckoai/http';

import { ApiProvide } from '../../../common/providers/api.provide';
import { PageInfo } from '../../../common/models/definitions/PageInfo';
import { HttpResource } from '../../../common/models/definitions/HttpResource';

import { AutoTable } from '@packages/components';
import { useState } from 'react';
import { Button, Card, Flex } from 'antd';
import * as Search from './search';
import { useI18n } from '@geckoai/i18n-react';
import { SiteLocale } from '../../../common/locales';
import { SysAccountVo } from './models/definitions/SysAccountVo';
import { ConfigureService } from '../../../common/services/configure-service';

export function Component() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useRxLoaderData();
  const configureService = useService<ConfigureService>(ConfigureService);
  const service = useService<HttpClient>(ApiProvide.provide);
  const locales = useI18n<SiteLocale>();

  const viewModel = useRxViewModel(
    combineLatest([data, configureService.tenant]).pipe(
      tap(() => setLoading(true)),
      switchMap(([data, tenantId]) => {
        data.tenantId = tenantId ?? '';
        return service
          .observable<HttpResource<PageInfo<SysAccountVo>>>(data)
          .pipe(map((x) => x.data.data));
      }),
      tap(() => setLoading(false)),
      finalize(() => setLoading(false)),
    ),
  );

  const response = viewModel.useValue();

  return (
    <Flex
      vertical
      gap={10}
      style={{
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Card style={{ flexShrink: 0 }}>
        <Search.Form
          layout="inline"
          autoComplete="new-password"
          initialValues={data.value}
          onFinish={(v) =>
            setData((ori) => ({
              ...ori,
              ...v,
              pageNum: 1,
            }))
          }
        >
          <Search.Keyword placeholder={locales.please_input_keywords} />
          <Button htmlType="submit" type="primary" children={locales.search} />
        </Search.Form>
      </Card>

      <AutoTable.Card<SysAccountVo>
        style={{ flex: 1 }}
        loading={loading}
        dataSource={response?.list}
        columns={[
          {
            dataIndex: 'id',
            title: '#',
          },
          {
            dataIndex: 'name',
            title: 'Name',
          },
        ]}
        rowKey="id"
        pagination={{
          total: response?.total,
          current: response?.pageNum,
          pageSize: response?.pageSize,
          onChange: (pageNum, pageSize) =>
            setData((origin) => ({
              ...origin,
              pageSize,
              pageNum,
            })),
        }}
      />
    </Flex>
  );
}

export default Component;

```


## Issues
Create [issues](https://github.com/geckoai/rx-react/issues) in this repository. When creating issues please search for existing issues to avoid duplicates.


## License
Licensed under the [MIT](https://github.com/geckoai/rx-react/blob/master/LICENSE) License.