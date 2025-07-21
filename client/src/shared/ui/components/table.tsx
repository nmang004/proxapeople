import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full">
    {/* Desktop table view - hidden on mobile */}
    <div className="hidden md:block overflow-auto">
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
    {/* Mobile card view container - handled by ResponsiveTable wrapper */}
    <div className="md:hidden">
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm hidden", className)}
        {...props}
      />
    </div>
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

// Mobile-responsive table wrapper
interface ResponsiveTableProps {
  children: React.ReactNode
  data?: any[]
  columns?: Array<{
    key: string
    label: string
    render?: (item: any) => React.ReactNode
  }>
  renderMobileCard?: (item: any) => React.ReactNode
  className?: string
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  children,
  data = [],
  columns = [],
  renderMobileCard,
  className
}) => {
  return (
    <div className={cn("relative w-full", className)}>
      {/* Desktop table view */}
      <div className="hidden md:block overflow-auto">
        {children}
      </div>
      
      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={index}>
              {renderMobileCard ? (
                renderMobileCard(item)
              ) : (
                <MobileTableCard item={item} columns={columns} />
              )}
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No data available
          </div>
        )}
      </div>
    </div>
  )
}

// Default mobile card component
interface MobileTableCardProps {
  item: any
  columns: Array<{
    key: string
    label: string
    render?: (item: any) => React.ReactNode
  }>
}

const MobileTableCard: React.FC<MobileTableCardProps> = ({ item, columns }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
      <div className="space-y-3">
        {columns.map((column) => (
          <div key={column.key} className="flex flex-col sm:flex-row sm:justify-between">
            <dt className="text-sm font-medium text-muted-foreground mb-1 sm:mb-0">
              {column.label}
            </dt>
            <dd className="text-sm font-medium text-foreground">
              {column.render ? column.render(item) : item[column.key]}
            </dd>
          </div>
        ))}
      </div>
    </div>
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  ResponsiveTable,
  MobileTableCard,
}
