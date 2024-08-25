import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TableProps<T> = {
  keys: (keyof T)[];
  data: T[];
};

const BasicTable = <T extends Record<string, any>>({
  keys,
  data,
}: TableProps<T>) => {
  if (data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            {keys.map((key) => (
              <TableHead key={String(key)}>{String(key)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              {keys.map((key) => (
                <TableCell key={String(key)}>{item[key]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BasicTable;
