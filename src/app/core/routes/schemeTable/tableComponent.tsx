import { getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import { property } from "../../types";
import { useMemo, useState } from "react";

type TableComponentType = {
  columns: {
    key: string;
    label: string;
    property: property;
  }[],
  rows: Array<Record<string, React.JSX.Element | string>>,
  parseProperties: Array<Record<string, property>>,
  onSelectionChange: (e: Set<string>) => void,
  filterValue: string
}
export const TableComponent: React.FC<TableComponentType> = ({ columns, rows, parseProperties, filterValue, onSelectionChange }) => {
  const [selectedKeys, setSelectedKeys] = useState<Array<string>>([])

  const filteredItems = useMemo(() => {
    let filtered = [...rows]
    let values = parseProperties.map((value) => {
      return Object.values(value).map((entry) => {
        if (entry.value && typeof entry.value === 'string')
          return entry.value.toLocaleLowerCase().includes(filterValue.toLowerCase())
        else return false
      }).reduce((a, b) => {
        if (a || b) return true
        return false
      })
    })
    return filtered = filtered.filter((_, i) => values[i])
  }, [filterValue, parseProperties, rows])

  return (
    <Table
      aria-label="Example static collection table"
      selectionMode="multiple"
      selectedKeys={selectedKeys}
      onSelectionChange={value => {
        onSelectionChange(value as Set<string>)
        setSelectedKeys(Array.from(value as Set<string>))
      }}>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={filteredItems}>
        {(item) => (
          <TableRow key={(item.key as string)}>
            {(columnKey) => {
              return <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
