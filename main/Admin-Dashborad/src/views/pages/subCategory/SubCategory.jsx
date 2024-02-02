import { Button, Switch } from '@mui/material'
import MUIDataTable from 'mui-datatables'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Icons from '@mui/icons-material'
import { ToastContainer, toast } from 'react-toastify'
import swal from 'sweetalert'
import { deleteSubCategory, getAllSubCategory, updateSubCatStatus } from 'src/redux/api/api'

const SubCategory = () => {
  const navigate = useNavigate()
  const [dataTableData, setDataTable] = useState([])

  const subCategoryList = async () => {
    await getAllSubCategory()
      .then((res) => {
        console.log(res.data.subCategory)
        const transformedData = res.data.subCategory.map((subCategory) => ({
          ...subCategory,
          languagesName: subCategory.languages == null ? '' : subCategory.languages.languagesName,
          categoryName: subCategory.category == null ? '' : subCategory.category.categoryName,
        }))

        setDataTable(transformedData)
      })
      .catch((err) => {
        console.log(err)
        if (!err.response.data.success) {
          if (err.response.data.status === 401) {
            toast.error(err.response.data.message)
          } else {
            toast.error(err.response.data, 'else')
          }
        }
      })
  }
  useEffect(() => {
    subCategoryList()
  }, [])

  const columns = [
    {
      name: 'index',
      label: 'No',
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return tableMeta.rowIndex + 1
        },
      },
    },
    {
      name: 'subCategoryName',
      label: 'sub Category ',
      options: {
        filter: true,
        sort: true,
        toUpperCase: true,
      },
    },

    {
      name: 'categoryName',
      label: 'Category',
      options: {
        filter: true,
        sort: false,
        toUpperCase: true,
      },
    },
    {
      name: 'languagesName',
      label: 'Languages',
      options: {
        filter: true,
        sort: false,
        toUpperCase: true,
      },
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: true,
        sort: false,
        customBodyRender: (_, { rowIndex }) => {
          const { status, _id } = dataTableData[rowIndex]
          return (
            <Switch
              checked={status}
              onChange={() => {
                const data = { id: _id, status: !status }
                updateSubCatStatus(data, _id)
                  .then(() => {
                    toast.success('status changed successfully!', {
                      key: data._id,
                    })
                    subCategoryList()
                  })
                  .catch(() => {
                    toast.error('something went wrong!', {
                      key: data._id,
                    })
                  })
              }}
            />
          )
        },
      },
    },
    {
      name: '_id',
      label: 'Action',
      options: {
        customBodyRender: (value) => {
          return (
            <div>
              <Icons.EditRounded
                className="editButton"
                onClick={() => {
                  const editData = dataTableData.find((data) => data._id === value)
                  navigate('/sub-category-form', {
                    state: { editData: editData },
                  })
                }}
              ></Icons.EditRounded>
              <Icons.DeleteRounded
                className="deleteButton"
                onClick={async () => {
                  const confirm = await swal({
                    title: 'Are you sure?',
                    text: 'Are you sure? Want to delete Location? All related data will also be deleted',
                    icon: 'warning',
                    buttons: ['No, cancel it!', 'Yes, I am sure!'],
                    dangerMode: true,
                  })
                  if (confirm) {
                    deleteSubCategory(value)
                      .then(() => {
                        toast.success('deleted successfully!', {
                          key: value,
                        })
                        subCategoryList()
                      })
                      .catch(() => {
                        toast.error('something went wrong!', {
                          key: value,
                        })
                      })
                  }
                }}
              ></Icons.DeleteRounded>
            </div>
          )
        },
      },
    },
  ]

  const options = {
    // filterType: 'checkbox',
    selectableRows: 'none',
  }

  return (
    <>
      <ToastContainer />
      <div className="right-text">
        <Button
          variant="contained"
          size="medium"
          className="AddButton"
          onClick={() => navigate('/sub-category-form')}
        >
          Add SubCategory
        </Button>
      </div>
      <MUIDataTable
        title={'Sub Category List'}
        data={dataTableData}
        columns={columns}
        options={options}
      />
    </>
  )
}

export default SubCategory
